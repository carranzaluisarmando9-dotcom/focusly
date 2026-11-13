import type { Mode } from '../../utils/timer'
export type Settings = Record<Mode,number>
export const defaultSettings:Settings={focus:25,short:5,long:15}
export type Session={id:string;endedAt:string;durationMs:number;taskId:string|null;taskTitle:string|null}
export function addSession(history:Session[],session:Session):Session[]{return history.some(s=>s.id===session.id)?history:[...history,session]}
