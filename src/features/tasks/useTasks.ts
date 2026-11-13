import { undoTask,undoFor,type Undo } from './organization'
import { useEffect,useState,type SetStateAction,type Dispatch } from 'react'
import { localDate,reducer,type State,type Action } from './model'
export function useTasks(state:State,setState:(state:SetStateAction<State>)=>void) {
 const [undo,setUndo]=useState<Undo|null>(null)
 const dispatch:Dispatch<Action>=(action)=>setState(previous=>{const next=reducer(previous,action);if(action.type!=='select')setUndo(undoFor(previous,next,action));return next})
 const undoLast=()=>{if(undo){setState(previous=>undoTask(previous,undo));setUndo(null)}}
 const [today,setToday]=useState(()=>localDate(new Date()))
 useEffect(()=>{const sync=()=>setToday(localDate(new Date()));const id=window.setInterval(sync,30000);window.addEventListener('focus',sync);document.addEventListener('visibilitychange',sync);return()=>{clearInterval(id);window.removeEventListener('focus',sync);document.removeEventListener('visibilitychange',sync)}},[])
 return {...state,dispatch,today,undoLast,canUndo:!!undo,activeTask:state.tasks.find(t=>t.id===state.activeId)}
}
