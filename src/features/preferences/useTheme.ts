import { useEffect,useState } from 'react'
import { readTheme,resolveTheme,saveTheme,type Theme } from './model'
export function useTheme(){
 const [theme,setTheme]=useState<Theme>(()=>{try{return readTheme(window.localStorage)}catch{return 'system'}})
 const [error,setError]=useState(false)
 useEffect(()=>{const media=window.matchMedia('(prefers-color-scheme: dark)');const apply=()=>{document.documentElement.dataset.theme=resolveTheme(theme,media.matches);document.documentElement.style.colorScheme=resolveTheme(theme,media.matches)};apply();media.addEventListener('change',apply);return()=>media.removeEventListener('change',apply)},[theme])
 const select=(value:Theme)=>{setTheme(value);try{setError(!saveTheme(window.localStorage,value))}catch{setError(true)}}
 return {theme,select,error}
}
