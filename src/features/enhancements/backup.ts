import type { SavedData } from '../../storage/storage'
import { validData } from '../../storage/storage'
import type { Options } from './options'
import { validOptions } from './options'
export function encodeBackup(data:SavedData,options:Options,theme:string){return JSON.stringify({format:'focusly-backup',version:1,exportedAt:new Date().toISOString(),data,options,theme},null,2)}
export function decodeBackup(raw:string):{data:SavedData;options?:Options;theme?:'light'|'dark'|'system'}{
 const value:unknown=JSON.parse(raw)
 if(!value||typeof value!=='object')throw Error('El archivo no es un respaldo válido.')
 const backup=value as Record<string,unknown>
 if(backup.format!=='focusly-backup'||backup.version!==1||!validData(backup.data)||backup.options!==undefined&&!validOptions(backup.options))throw Error('El archivo no es un respaldo compatible de Focusly.')
 return {data:backup.data,options:validOptions(backup.options)?backup.options:undefined,theme:backup.theme==='light'||backup.theme==='dark'||backup.theme==='system'?backup.theme:undefined}
}
