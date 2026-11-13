import { describe,it,expect,vi,afterEach } from 'vitest'
import { restoreTimer,validTimer } from './timerPersistence'
import { freshTimer,startTimer } from '../../utils/timerState'
import { defaults,validData } from '../../storage/storage'
import { encodeBackup,decodeBackup } from './backup'
import { defaultOptions,validOptions } from './options'
import { extendedStatistics } from './statistics'
import { createTask,emptyDraft,reducer } from '../tasks/model'
import { organizeTasks,undoFor,undoTask } from '../tasks/organization'
afterEach(()=>vi.useRealTimers())
describe('durable timer recovery',()=>{
 it('keeps absolute deadlines and paused remaining time',()=>{vi.useFakeTimers();vi.setSystemTime(100000);const state=startTimer(freshTimer('focus',60000),Date.now(),'session');vi.advanceTimersByTime(10000);expect(restoreTimer(JSON.parse(JSON.stringify(state)),1500000).deadline).toBe(160000);const paused={...state,deadline:null,remaining:50000};expect(restoreTimer(paused,1500000)).toEqual(paused)})
 it.each([null,{}, {mode:'other'},{...freshTimer('focus'),remaining:-1},{...freshTimer('focus'),duration:Infinity},{...freshTimer('focus'),completed:true}])('rejects invalid timer data',value=>{expect(validTimer(value)).toBe(false);expect(restoreTimer(value,60000)).toEqual(freshTimer('focus',60000))})
})
describe('backups and preferences',()=>{
 it('round-trips existing data without changing identifiers or dates',()=>{const data=defaults();data.tasks.tasks=[createTask({...emptyDraft,title:'Trabajo',tags:['estudio'],subtasks:[{id:'sub',title:'Leer',completed:true}]},'id','2026-11-12T12:00:00Z')];expect(decodeBackup(encodeBackup(data,defaultOptions,'dark'))).toEqual({data,options:defaultOptions,theme:'dark'})})
 it('rejects malformed or unsupported backups',()=>{expect(()=>decodeBackup('{')).toThrow();expect(()=>decodeBackup(JSON.stringify({format:'focusly-backup',version:99,data:defaults()}))).toThrow()})
 it('validates goals, cycles and booleans',()=>{expect(validOptions(defaultOptions)).toBe(true);expect(validOptions({...defaultOptions,cycles:0})).toBe(false);expect(validOptions({...defaultOptions,dailyGoal:1441})).toBe(false);expect(validOptions({...defaultOptions,sound:'yes'})).toBe(false)})
 it('rejects malformed imported subtasks',()=>{const data=defaults();data.tasks.tasks=[{...createTask({...emptyDraft,title:'Task'},'id','2026-11-12T12:00:00Z'),subtasks:[{id:'one',title:'',completed:false}]}];expect(validData(data)).toBe(false)})
})
describe('task organization and safe undo',()=>{
 const one=createTask({...emptyDraft,title:'Primera',priority:'Low',tags:['estudio'],dueDate:'2026-11-13'},'one','2026-11-12T12:00:00Z')
 const two=createTask({...emptyDraft,title:'Segunda',priority:'High',dueDate:'2026-11-12'},'two','2026-11-12T13:00:00Z')
 it('searches titles and tags and sorts by priority or date',()=>{expect(organizeTasks([one,two],'estudio','','newest')).toEqual([one]);expect(organizeTasks([one,two],'','estudio','newest')).toEqual([one]);expect(organizeTasks([one,two],'','','priority')[0]).toBe(two);expect(organizeTasks([one,two],'','','date')[0]).toBe(two)})
 it('restores a deleted task and selection while preserving another new task',()=>{const before={tasks:[one],activeId:'one'};const action={type:'delete',id:'one'} as const;const after=reducer(before,action);const undo=undoFor(before,after,action)!;const state=undoTask({tasks:[two],activeId:null},undo);expect(state.tasks).toEqual([two,one]);expect(state.activeId).toBe('one')})
 it('does not overwrite a subsequent edit from another tab',()=>{const before={tasks:[one],activeId:null};const action={type:'toggle',id:'one'} as const;const after=reducer(before,action);const undo=undoFor(before,after,action)!;const current={tasks:[{...after.tasks[0],title:'Otra edición'}],activeId:null};expect(undoTask(current,undo)).toBe(current)})
})
describe('daily goals, weekly comparisons and task aggregation',()=>{
 it('splits adjacent local-calendar weeks and keeps deleted-task snapshots',()=>{vi.useFakeTimers();vi.setSystemTime(new Date(2026,10,12,18));const session=(id:string,date:Date,minutes:number)=>({id,endedAt:date.toISOString(),durationMs:minutes*60000,taskId:'deleted-task',taskTitle:'Título histórico'});const stats=extendedStatistics([session('a',new Date(2026,10,12,12),25),session('b',new Date(2026,10,5,12),15)],new Date());expect(stats.daily).toBe(1500000);expect(stats.current).toBe(1500000);expect(stats.prior).toBe(900000);expect(stats.tasks[0]).toMatchObject({title:'Título histórico',duration:2400000,sessions:2})})
})
