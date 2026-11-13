import { localDate } from '../tasks/model'
import type { Session } from '../productivity/model'
export function extendedStatistics(history:Session[],now:Date){
 const since=new Date(now);since.setHours(0,0,0,0);since.setDate(since.getDate()-6)
 const previous=new Date(since);previous.setDate(previous.getDate()-7)
 let current=0,prior=0
 const tasks=new Map<string,{title:string;duration:number;sessions:number}>()
 for(const s of history){const date=new Date(s.endedAt);if(date>=since&&date<=now)current+=s.durationMs;else if(date>=previous&&date<since)prior+=s.durationMs;const key=s.taskId??'unlinked';const item=tasks.get(key)??{title:s.taskTitle??'Sin tarea asociada',duration:0,sessions:0};item.duration+=s.durationMs;item.sessions++;tasks.set(key,item)}
 const daily=history.filter(s=>localDate(new Date(s.endedAt))===localDate(now)).reduce((sum,s)=>sum+s.durationMs,0)
 return {current,prior,daily,tasks:[...tasks.entries()].map(([id,item])=>({id,...item})).sort((a,b)=>b.duration-a.duration)}
}
