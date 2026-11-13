import { freshTimer,type TimerState } from '../../utils/timerState'
import type { Mode } from '../../utils/timer'
import { validSession } from '../../storage/storage'
export const TIMER_KEY='focusly:v1:timer'
export type DurableTimer=TimerState & { completedFocus?:number; advancedFrom?:string|null }
export function validTimer(v:unknown):v is DurableTimer{
 if(!v||typeof v!=='object')return false
 const s=v as Record<string,unknown>
 return ['focus','short','long'].includes(s.mode as Mode)&&typeof s.duration==='number'&&Number.isInteger(s.duration)&&s.duration>=60000&&s.duration<=7200000&&typeof s.remaining==='number'&&Number.isFinite(s.remaining)&&s.remaining>=0&&s.remaining<=s.duration&&(s.deadline===null||typeof s.deadline==='number'&&Number.isFinite(s.deadline)&&s.deadline>0)&&typeof s.completed==='boolean'&&(s.sessionId===null||typeof s.sessionId==='string'&&s.sessionId.length>0)&&(s.result===null||validSession(s.result))&&(s.completedFocus===undefined||typeof s.completedFocus==='number'&&Number.isInteger(s.completedFocus)&&s.completedFocus>=0)&&(s.advancedFrom===undefined||s.advancedFrom===null||typeof s.advancedFrom==='string')&&(!s.completed||s.remaining===0&&s.deadline===null)
}
export function restoreTimer(value:unknown,duration:number):DurableTimer{return validTimer(value)?value:freshTimer('focus',duration)}
