import { number } from '../../i18n/es-PE'
import { localDate } from '../tasks/model'
import type { Session } from './model'
export function statistics(history:Session[],now:Date){
 const days=Array.from({length:7},(_,index)=>{const d=new Date(now);d.setHours(12,0,0,0);d.setDate(d.getDate()-6+index);return {date:localDate(d),durationMs:0}})
 let total=0
 for(const session of history){total+=session.durationMs;const day=days.find(d=>d.date===localDate(new Date(session.endedAt)));if(day)day.durationMs+=session.durationMs}
 return {total,daily:days[6].durationMs,weekly:days.reduce((sum,d)=>sum+d.durationMs,0),count:history.length,days}
}
export function durationLabel(ms:number):string{const minutes=ms/60000;return minutes>=60?`${number(Number((minutes/60).toFixed(1)))} h`:`${number(Number(minutes.toFixed(1)))} min`}
