import { useEffect,useState } from 'react'
export function useFocusMode(){
 const [focused,setFocused]=useState(false);const [fullscreen,setFullscreen]=useState(false);const [error,setError]=useState('')
 useEffect(()=>{const sync=()=>setFullscreen(!!document.fullscreenElement);document.addEventListener('fullscreenchange',sync);return()=>document.removeEventListener('fullscreenchange',sync)},[])
 const toggleFullscreen=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();setError('')}catch{setError('Pantalla completa no disponible. El modo concentración sigue funcionando.')}}
 return {focused,setFocused,fullscreen,toggleFullscreen,error}
}
