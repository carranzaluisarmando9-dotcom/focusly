import { useEffect,useRef,useState } from 'react'
import type { Mode } from '../utils/timer'
import { freshTimer,pauseTimer,startTimer,syncTimer } from '../utils/timerState'
import { restoreTimer,TIMER_KEY,validTimer,type DurableTimer } from '../features/enhancements/timerPersistence'
import { announce,locked,readJSON,writeJSON } from '../storage/transactions'
import type { Options } from '../features/enhancements/options'
import type { Session,Settings } from '../features/productivity/model'
export function useTimer(settings:Settings,task:{id:string;title:string}|undefined,onComplete:(session:Session)=>void,options?:Options) {
 const [state,setState]=useState<DurableTimer>(()=>{try{return restoreTimer(readJSON(TIMER_KEY),settings.focus*60000)}catch{return freshTimer('focus',settings.focus*60000)}})
 const [error,setError]=useState('')
 const latest=useRef({task,onComplete,settings,options})
 const memory=useRef(state);const memoryOnly=useRef(false)
 useEffect(()=>{latest.current={task,onComplete,settings,options}},[task,onComplete,settings,options])
 const change=useRef<(fn:(state:DurableTimer)=>DurableTimer)=>void>(()=>{})
 useEffect(()=>{
 const read=()=>{if(memoryOnly.current)return memory.current;try{const value=readJSON(TIMER_KEY);if(value===null)return memory.current;if(validTimer(value))return value;setError('No se pudo recuperar la sesión guardada. Reinicia para comenzar una sesión nueva.');return memory.current}catch{return memory.current}}
 change.current=(fn)=>void locked(TIMER_KEY,()=>{const base=read();const next=fn(base);memory.current=next;setState(next);try{writeJSON(TIMER_KEY,next);memoryOnly.current=false;setError('');announce(TIMER_KEY)}catch{memoryOnly.current=true;setError('La sesión no puede guardarse. Se mantendrá en esta pestaña.')}})
 const sync=()=>{
 const base=read();const next={...base,...syncTimer(base,Date.now(),latest.current.task)}
 if(next.completed&&!base.completed){change.current(s=>{const next=syncTimer(s,Date.now(),latest.current.task);return {...s,...next,completedFocus:(s.completedFocus??0)+(!s.completed&&next.completed&&s.mode==='focus'?1:0)}});return}
 memory.current=next;setState(previous=>previous.remaining===next.remaining&&previous.deadline===next.deadline&&previous.sessionId===next.sessionId&&previous.mode===next.mode&&previous.completed===next.completed&&previous.duration===next.duration?previous:next)
 }
 const storage=(e:StorageEvent)=>{if(e.key===TIMER_KEY||e.key===null)sync()}
 const changed=(e:Event)=>{if((e as CustomEvent<string>).detail===TIMER_KEY)sync()}
 const interval=window.setInterval(sync,200);window.addEventListener('storage',storage);window.addEventListener('focusly:change',changed);document.addEventListener('visibilitychange',sync);window.addEventListener('focus',sync);sync()
 return()=>{clearInterval(interval);window.removeEventListener('storage',storage);window.removeEventListener('focusly:change',changed);document.removeEventListener('visibilitychange',sync);window.removeEventListener('focus',sync)}
 },[])
 useEffect(()=>{if(state.result)latest.current.onComplete(state.result)},[state.result])
 const start=()=>{const id=crypto.randomUUID();change.current(s=>({...s,...startTimer(s,Date.now(),id)}))}
 const pause=()=>change.current(s=>{const next=pauseTimer(s,Date.now(),latest.current.task);return {...s,...next,completedFocus:(s.completedFocus??0)+(!s.completed&&next.completed&&s.mode==='focus'?1:0)}})
 const reset=()=>change.current(s=>({...freshTimer(s.mode,latest.current.settings[s.mode]*60000),completedFocus:s.completedFocus??0}))
 const selectMode=(mode:Mode)=>change.current(s=>({...freshTimer(mode,latest.current.settings[mode]*60000),completedFocus:s.completedFocus??0}))
 const advance=(sessionId:string)=>change.current(s=>{
 if(!s.completed||s.sessionId!==sessionId||s.advancedFrom===sessionId)return s
 const count=s.completedFocus??0;const mode:Mode=s.mode==='focus'?(count%(latest.current.options?.cycles??4)===0?'long':'short'):'focus'
 const fresh={...freshTimer(mode,latest.current.settings[mode]*60000),completedFocus:count,advancedFrom:sessionId}
 return mode!=='focus'&&latest.current.options?.autoBreak?{...fresh,...startTimer(fresh,Date.now(),crypto.randomUUID())}:fresh
 })
 useEffect(()=>{
 if(!state.completed||state.mode!=='focus'||!state.sessionId||!options?.autoBreak)return
 const id=state.sessionId
 change.current(s=>{if(!s.completed||s.sessionId!==id||s.advancedFrom===id)return s;const count=s.completedFocus??0;const mode:Mode=count%(latest.current.options?.cycles??4)===0?'long':'short';const fresh={...freshTimer(mode,latest.current.settings[mode]*60000),completedFocus:count,advancedFrom:id};return {...fresh,...startTimer(fresh,Date.now(),crypto.randomUUID())}})
 },[state.completed,state.mode,state.sessionId,options?.autoBreak])
 return {...state,error,running:state.deadline!==null,start,pause,reset,selectMode,advance}
}
