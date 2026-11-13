export type Theme = 'light' | 'dark' | 'system'
export const THEME_KEY='focusly:v1:theme'
export function validTheme(value:unknown):value is Theme{return value==='light'||value==='dark'||value==='system'}
export function resolveTheme(theme:Theme,dark:boolean):'light'|'dark'{return theme==='system'?(dark?'dark':'light'):theme}
export function readTheme(storage:Pick<Storage,'getItem'>):Theme{try{const value=storage.getItem(THEME_KEY);return validTheme(value)?value:'system'}catch{return 'system'}}
export function saveTheme(storage:Pick<Storage,'setItem'>,theme:Theme):boolean{try{storage.setItem(THEME_KEY,theme);return true}catch{return false}}
export function shortcut(key:string,blocked:boolean,modified:boolean,repeat:boolean):'toggle'|'reset'|'new'|null{if(blocked||modified||repeat)return null;return key===' '?'toggle':key.toLowerCase()==='r'?'reset':key.toLowerCase()==='n'?'new':null}
