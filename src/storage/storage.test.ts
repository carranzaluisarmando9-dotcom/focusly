import { describe,it,expect,vi,afterEach } from 'vitest'
import { defaults,load,save,STORAGE_KEY,type StoragePort } from './storage'
import { createTask,emptyDraft } from '../features/tasks/model'
const memory=():StoragePort=>{const map=new Map<string,string>();return {getItem:k=>map.get(k)??null,setItem:(k,v)=>{map.set(k,v)}}}
afterEach(()=>vi.useRealTimers())
describe('versioned persistence',()=>{
 it('restores tasks, active selection, settings and history without initial overwrite',()=>{const storage=memory();const data=defaults();data.tasks={tasks:[createTask({...emptyDraft,title:'Saved'},'id',new Date().toISOString())],activeId:'id'};data.settings={focus:40,short:7,long:20};data.history=[{id:'s',endedAt:new Date().toISOString(),durationMs:60000,taskId:'id',taskTitle:'Saved'}];expect(save(storage,data)).toBe(true);expect(load(storage)).toEqual({data,error:null})})
 it('uses defaults for missing data',()=>expect(load(memory()).data).toEqual(defaults()))
 it.each(['not json',JSON.stringify({version:99,data:defaults()}),JSON.stringify({version:1,data:{...defaults(),settings:{focus:0,short:5,long:15}}}),JSON.stringify({version:1,data:{...defaults(),history:[{id:'bad'}]}})])('rejects corrupt or unsupported data without deleting it',raw=>{const storage=memory();storage.setItem(STORAGE_KEY,raw);expect(load(storage).error).toBeTruthy();expect(storage.getItem(STORAGE_KEY)).toBe(raw)})
 it('handles blocked storage and quota failures',()=>{const storage={getItem:()=>{throw Error('blocked')},setItem:()=>{throw Error('quota')}};expect(load(storage).error).toBeTruthy();expect(save(storage,defaults())).toBe(false)})
 it('rejects invalid active task and malformed tasks',()=>{const storage=memory();storage.setItem(STORAGE_KEY,JSON.stringify({version:1,data:{...defaults(),tasks:{tasks:[],activeId:'missing'}}}));expect(load(storage).error).toBeTruthy();storage.setItem(STORAGE_KEY,JSON.stringify({version:1,data:{...defaults(),tasks:{tasks:[{id:'x'}],activeId:null}}}));expect(load(storage).error).toBeTruthy()})
})
