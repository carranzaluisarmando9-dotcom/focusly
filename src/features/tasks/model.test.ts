import { describe,it,expect } from 'vitest'
import { createTask,emptyDraft,filterTasks,localDate,reducer,validate,type State } from './model'
const draft={...emptyDraft,title:' Read ',dueDate:'2026-11-12'}
const task=createTask(draft,'one','original-date')
const initial:State={tasks:[task],activeId:null}
describe('task management',()=>{
 it('creates a valid task with a stable identity',()=>{expect(task).toMatchObject({id:'one',title:'Read',createdAt:'original-date',completed:false})})
 it('rejects empty and oversized fields and invalid dates',()=>{expect(()=>createTask({...draft,title:'  '},'x','now')).toThrow();expect(validate({...draft,title:'a'.repeat(101)})).toBeTruthy();expect(validate({...draft,description:'a'.repeat(501)})).toBeTruthy();expect(validate({...draft,dueDate:'2026-02-30'})).toBeTruthy()})
 it('edits fields while preserving identity and completion',()=>{const state=reducer({...initial,tasks:[{...task,completed:true}]},{type:'edit',id:'one',draft:{...draft,title:'Updated',priority:'High'}});expect(state.tasks[0]).toMatchObject({id:'one',createdAt:'original-date',completed:true,title:'Updated',priority:'High'})})
 it('does not accept invalid edits',()=>{expect(reducer(initial,{type:'edit',id:'one',draft:{...draft,title:''}})).toBe(initial)})
 it('completes and reopens tasks',()=>{const completed=reducer(initial,{type:'toggle',id:'one'});expect(completed.tasks[0].completed).toBe(true);expect(reducer(completed,{type:'toggle',id:'one'}).tasks[0].completed).toBe(false)})
 it('selects, switches and deselects a pending task',()=>{const two=createTask({...draft,title:'Other'},'two','now');const state={tasks:[task,two],activeId:null};expect(reducer(state,{type:'select',id:'one'}).activeId).toBe('one');expect(reducer({...state,activeId:'one'},{type:'select',id:'two'}).activeId).toBe('two');expect(reducer({...state,activeId:'one'},{type:'select',id:null}).activeId).toBeNull();expect(reducer(state,{type:'select',id:'missing'}).activeId).toBeNull()})
 it('clears active selection when completed or deleted',()=>{const state={...initial,activeId:'one'};expect(reducer(state,{type:'toggle',id:'one'}).activeId).toBeNull();expect(reducer(state,{type:'delete',id:'one'})).toEqual({tasks:[],activeId:null})})
 it('cannot activate a completed task',()=>{expect(reducer({tasks:[{...task,completed:true}],activeId:null},{type:'select',id:'one'}).activeId).toBeNull()})
 it('filters all, today, pending and completed immediately',()=>{const tasks=[task,{...task,id:'two',dueDate:'',completed:true}];expect(filterTasks(tasks,'All Tasks','2026-11-12')).toHaveLength(2);expect(filterTasks(tasks,'Today','2026-11-12')).toEqual([task]);expect(filterTasks(tasks,'Pending','2026-11-12')).toEqual([task]);expect(filterTasks(tasks,'Completed','2026-11-12')[0].id).toBe('two');expect(filterTasks(tasks,'Today','2026-11-13')).toHaveLength(0)})
 it('formats dates using local calendar fields',()=>{expect(localDate(new Date(2026,0,2,23,59))).toBe('2026-01-02')})
})
