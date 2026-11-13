import { MODES,remainingAt,type Mode } from './timer'
import type { Session } from '../features/productivity/model'
export type TimerState={mode:Mode;duration:number;remaining:number;deadline:number|null;completed:boolean;sessionId:string|null;result:Session|null}
export function freshTimer(mode:Mode,duration=MODES[mode].duration):TimerState{return {mode,duration,remaining:duration,deadline:null,completed:false,sessionId:null,result:null}}
export function syncTimer(s:TimerState,now:number,task:{id:string;title:string}|undefined):TimerState{
 if(s.deadline===null)return s
 const remaining=remainingAt(s.deadline,now)
 if(remaining>0)return {...s,remaining}
 return {...s,remaining:0,deadline:null,completed:true,result:s.mode==='focus'&&s.sessionId?{id:s.sessionId,endedAt:new Date(s.deadline).toISOString(),durationMs:s.duration,taskId:task?.id??null,taskTitle:task?.title??null}:null}
}
export function startTimer(s:TimerState,now:number,id:string):TimerState{return s.deadline!==null||s.remaining===0?s:{...s,deadline:now+s.remaining,sessionId:s.sessionId??id}}
export function pauseTimer(s:TimerState,now:number,task:{id:string;title:string}|undefined):TimerState{const current=syncTimer(s,now,task);return {...current,deadline:null}}
