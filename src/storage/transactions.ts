// Web Locks serialize all cooperating tabs on this origin.
export function locked<T>(key:string,action:()=>T|Promise<T>):Promise<T>{
 if(typeof navigator!=='undefined'&&navigator.locks){
  return new Promise<T>((resolve,reject)=>{void navigator.locks.request(key,()=>Promise.resolve().then(action).then(resolve,reject)).catch(reject)})
 }
 return Promise.resolve().then(action)
}
export function readJSON(key:string):unknown { const raw=localStorage.getItem(key);return raw===null?null:JSON.parse(raw) }
export function writeJSON(key:string,value:unknown){localStorage.setItem(key,JSON.stringify(value))}
export function announce(key:string){window.dispatchEvent(new CustomEvent('focusly:change',{detail:key}))}
