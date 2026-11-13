import type { Action,State,Task } from './model'
export type Undo={id:string;before:Task|undefined;after:Task|undefined;wasActive:boolean}
export function undoTask(state:State,undo:Undo):State{
 const current=state.tasks.find(t=>t.id===undo.id)
 if(JSON.stringify(current)!==JSON.stringify(undo.after))return state
 const tasks=undo.before?current?state.tasks.map(t=>t.id===undo.id?undo.before!:t):[...state.tasks,undo.before]:state.tasks.filter(t=>t.id!==undo.id)
 return {tasks,activeId:undo.wasActive&&!state.activeId&&undo.before&&!undo.before.completed?undo.id:state.activeId===undo.id&&!tasks.some(t=>t.id===undo.id&&!t.completed)?null:state.activeId}
}
export function undoFor(before:State,after:State,action:Action):Undo|null{
 if(action.type==='select')return null
 const id=action.type==='create'?action.task.id:action.id
 return {id,before:before.tasks.find(t=>t.id===id),after:after.tasks.find(t=>t.id===id),wasActive:before.activeId===id}
}
export function organizeTasks(tasks:Task[],query:string,tag:string,sort:string):Task[]{
 const normalized=query.toLocaleLowerCase('es-PE')
 const priorities={High:0,Medium:1,Low:2}
 return tasks.filter(t=>`${t.title} ${t.description} ${(t.tags??[]).join(' ')}`.toLocaleLowerCase('es-PE').includes(normalized)&&(!tag||t.tags?.includes(tag))).sort((a,b)=>sort==='priority'?priorities[a.priority]-priorities[b.priority]:sort==='date'?(a.dueDate||'9999').localeCompare(b.dueDate||'9999'):b.createdAt.localeCompare(a.createdAt))
}
