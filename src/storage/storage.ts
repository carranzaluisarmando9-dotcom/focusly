import { t } from '../i18n/es-PE'
import { validate,type State,type Task } from '../features/tasks/model'
import { defaultSettings,type Settings,type Session } from '../features/productivity/model'
export const STORAGE_KEY='focusly:v1:data'
export type SavedData={tasks:State;settings:Settings;history:Session[]}
export const defaults=():SavedData=>({tasks:{tasks:[],activeId:null},settings:{...defaultSettings},history:[]})
const object=(v:unknown):v is Record<string,unknown>=>typeof v==='object'&&v!==null
const date=(v:unknown):v is string=>typeof v==='string'&&Number.isFinite(Date.parse(v))
export function validTask(v:unknown):v is Task{return object(v)&&(v.tags===undefined||Array.isArray(v.tags)&&v.tags.length<=10&&v.tags.every(tag=>typeof tag==='string'&&tag.trim().length>0&&tag.length<=30))&&(v.subtasks===undefined||Array.isArray(v.subtasks)&&v.subtasks.length<=30&&v.subtasks.every(item=>object(item)&&typeof item.id==='string'&&!!item.id&&typeof item.title==='string'&&!!item.title.trim()&&item.title.length<=100&&typeof item.completed==='boolean')&&new Set(v.subtasks.map(item=>item.id)).size===v.subtasks.length)&&typeof v.id==='string'&&v.id.length>0&&date(v.createdAt)&&typeof v.completed==='boolean'&&typeof v.title==='string'&&typeof v.description==='string'&&typeof v.dueDate==='string'&&(v.priority==='High'||v.priority==='Medium'||v.priority==='Low')&&!validate({title:v.title,description:v.description,dueDate:v.dueDate,priority:v.priority})}
export function validSettings(v:unknown):v is Settings{return object(v)&&['focus','short','long'].every(k=>typeof v[k]==='number'&&Number.isInteger(v[k])&&v[k]>=1&&v[k]<=120)}
export function validSession(v:unknown):v is Session{return object(v)&&typeof v.id==='string'&&v.id.length>0&&date(v.endedAt)&&typeof v.durationMs==='number'&&Number.isFinite(v.durationMs)&&v.durationMs>0&&v.durationMs<=120*60000&&(v.taskId===null||typeof v.taskId==='string')&&(v.taskTitle===null||typeof v.taskTitle==='string')}
export function validData(v:unknown):v is SavedData {
 if(!object(v)||!object(v.tasks))return false
 const state=v.tasks
 return Array.isArray(state.tasks)&&state.tasks.every(validTask)&&new Set(state.tasks.map(t=>t.id)).size===state.tasks.length&&(state.activeId===null||state.tasks.some(t=>t.id===state.activeId&&!t.completed))&&validSettings(v.settings)&&Array.isArray(v.history)&&v.history.every(validSession)&&new Set(v.history.map(s=>s.id)).size===v.history.length
}
export type StoragePort=Pick<Storage,'getItem'|'setItem'>
export function load(storage:StoragePort):{data:SavedData;error:string|null}{try{const raw=storage.getItem(STORAGE_KEY);if(raw===null)return {data:defaults(),error:null};const envelope:unknown=JSON.parse(raw);if(!object(envelope)||envelope.version!==1||!validData(envelope.data))throw new Error('Invalid data');return {data:envelope.data,error:null}}catch{return {data:defaults(),error:t("Saved data could not be read. Changes are kept in memory; the original storage is preserved.")}}}
export function save(storage:StoragePort,data:SavedData):boolean{try{storage.setItem(STORAGE_KEY,JSON.stringify({version:1,data}));return true}catch{return false}}
export function loadBrowser(){try{return load(window.localStorage)}catch{return {data:defaults(),error:t("Local storage is unavailable. Changes will only remain in this tab.")}}}
export function saveBrowser(data:SavedData){try{return save(window.localStorage,data)}catch{return false}}
