import { describe,it,expect } from 'vitest'
import { t,text,number,formatDate } from './es-PE'
import { durationLabel } from '../features/productivity/statistics'
import { load,save,defaults } from '../storage/storage'
import { createTask,emptyDraft } from '../features/tasks/model'
describe('Peruvian Spanish localization',()=>{
 it('translates modes, actions and preserved internal values',()=>{expect(t('Focus')).toBe('Concentración');expect(t('High')).toBe('Alta');expect(t('All Tasks')).toBe('Todas');expect(t('Save task')).toBe('Guardar tarea')})
 it('uses singular and plural for dynamic quantities',()=>{expect(text.pendingTasks(1)).toBe('1 tarea pendiente');expect(text.pendingTasks(2)).toBe('2 tareas pendientes');expect(text.completedTasks(1)).toBe('1 tarea completada');expect(text.sessions(1)).toBe('1 sesión');expect(text.sessions(2)).toBe('2 sesiones');expect(text.minutes(1)).toBe('1 minuto');expect(text.minutes(25)).toBe('25 minutos');expect(text.nextMinutes(1)).toBe('TU PRÓXIMO MINUTO')})
 it('formats numbers, durations and calendar dates with es-PE',()=>{expect(number(1234.5)).toBe(new Intl.NumberFormat('es-PE',{maximumFractionDigits:1}).format(1234.5));expect(durationLabel(90000)).toBe(`${number(1.5)} min`);expect(durationLabel(5400000)).toBe(`${number(1.5)} h`);expect(formatDate(new Date(2026,10,12,12),{month:'long',day:'numeric'})).toContain('noviembre')})
 it('preserves original user content and persisted English priority values',()=>{const data=defaults();data.tasks={tasks:[createTask({...emptyDraft,title:'Original user title',priority:'High',dueDate:'2026-11-12'},'task','2026-11-12T12:00:00Z')],activeId:'task'};let raw='';const storage={getItem:()=>raw,setItem:(_key:string,value:string)=>{raw=value}};save(storage,data);expect(load(storage).data).toEqual(data);expect(load(storage).data.tasks.tasks[0].priority).toBe('High')})
})
