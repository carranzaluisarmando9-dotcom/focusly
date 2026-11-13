import { useEffect,useRef,useState,type SetStateAction } from 'react'
import { loadBrowser,saveBrowser,STORAGE_KEY,validData,type SavedData } from '../../storage/storage'
import { announce,locked } from '../../storage/transactions'
import { addSession,type Session,type Settings } from './model'
export function useProductivity(){
 const [initial]=useState(loadBrowser)
 const [data,setData]=useState(initial.data)
 const current=useRef(initial.data)
 const [error,setError]=useState<string|null>(initial.error)
 const blocked=useRef(!!initial.error)
 const memoryOnly=useRef(!!initial.error)
 useEffect(()=>{
 const sync=()=>{const result=loadBrowser();if(result.error){blocked.current=true;setError(result.error);return}if(memoryOnly.current)return;current.current=result.data;setData(result.data)}
 const storage=(e:StorageEvent)=>{if(e.key===STORAGE_KEY||e.key===null)sync()}
 const changed=(e:Event)=>{if((e as CustomEvent<string>).detail===STORAGE_KEY)sync()}
 window.addEventListener('storage',storage);window.addEventListener('focusly:change',changed)
 return()=>{window.removeEventListener('storage',storage);window.removeEventListener('focusly:change',changed)}
 },[])
 const update=(apply:(data:SavedData)=>SavedData)=>void locked(STORAGE_KEY,()=>{
 const loaded=loadBrowser();const base=memoryOnly.current||loaded.error?current.current:loaded.data
 if(loaded.error)blocked.current=true
 const next=apply(base)
 if(next===base)return
 current.current=next;setData(next)
 if(blocked.current||!saveBrowser(next)){memoryOnly.current=true;setError('No se pudieron guardar los cambios. Exporta un respaldo; tus cambios siguen en esta pestaña.');return}
 memoryOnly.current=false;setError(null);announce(STORAGE_KEY)
 }).catch(()=>setError('No se pudo actualizar el almacenamiento. Tus datos actuales se conservan.'))
 const record=(session:Session)=>update(d=>{const history=addSession(d.history,session);return history===d.history?d:{...d,history}})
 const setSettings=(settings:Settings)=>update(d=>({...d,settings}))
 const setTasks=(value:SetStateAction<SavedData['tasks']>)=>update(d=>({...d,tasks:typeof value==='function'?value(d.tasks):value}))
 const importData=(value:SavedData)=>{if(!validData(value))throw Error('Respaldo no válido.');update(d=>{
 const tasks=[...d.tasks.tasks,...value.tasks.tasks.filter(t=>!d.tasks.tasks.some(old=>old.id===t.id))]
 const history=value.history.reduce(addSession,d.history)
 return {...d,tasks:{...d.tasks,tasks},history}
 })}
 return {data,record,setSettings,setTasks,importData,error}
}
