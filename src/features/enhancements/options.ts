import { useEffect,useState } from 'react'
import { announce,readJSON,writeJSON } from '../../storage/transactions'
export const OPTIONS_KEY='focusly:v1:options'
export type Options={shortcuts:boolean;sound:boolean;notifications:boolean;dailyGoal:number;cycles:number;autoBreak:boolean}
export const defaultOptions:Options={shortcuts:true,sound:false,notifications:false,dailyGoal:120,cycles:4,autoBreak:false}
export function validOptions(v:unknown):v is Options{if(!v||typeof v!=='object')return false;const o=v as Record<string,unknown>;return ['shortcuts','sound','notifications','autoBreak'].every(k=>typeof o[k]==='boolean')&&typeof o.dailyGoal==='number'&&Number.isInteger(o.dailyGoal)&&o.dailyGoal>=1&&o.dailyGoal<=1440&&typeof o.cycles==='number'&&Number.isInteger(o.cycles)&&o.cycles>=1&&o.cycles<=12}
function loadOptions(){try{const value=readJSON(OPTIONS_KEY);return validOptions(value)?value:defaultOptions}catch{return defaultOptions}}
export function useOptions(){
 const [options,setOptions]=useState(loadOptions);const [error,setError]=useState('')
 useEffect(()=>{const sync=()=>setOptions(loadOptions());window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync)},[])
 const save=(value:Options)=>{if(!validOptions(value)){setError('Revisa los valores: objetivo de 1 a 1440 minutos y ciclos de 1 a 12.');return}setOptions(value);try{writeJSON(OPTIONS_KEY,value);announce(OPTIONS_KEY);setError('Preferencias guardadas.')}catch{setError('Las preferencias solo se conservarán en esta pestaña.')}}
 return {options,save,error}
}
