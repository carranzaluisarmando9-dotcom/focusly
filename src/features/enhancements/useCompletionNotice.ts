import { useEffect,useRef,useState } from 'react'
import type { Options } from './options'
import { locked,readJSON,writeJSON } from '../../storage/transactions'
export function useCompletionNotice(id:string|null,completed:boolean,options:Options){
 const audio=useRef<AudioContext|null>(null);const [message,setMessage]=useState('')
 const prepare=()=>{if(options.sound){audio.current??=new AudioContext();void audio.current.resume().catch(()=>{})}}
 useEffect(()=>()=>{void audio.current?.close()},[])
 useEffect(()=>{if(!completed||!id)return;void locked('focusly:notice',()=>{
 try{if(readJSON('focusly:v1:last-notice')===id)return;writeJSON('focusly:v1:last-notice',id)}catch{/* In-memory browsers still receive the visual completion message. */}
 if(options.sound&&audio.current?.state==='running'){const context=audio.current;const oscillator=context.createOscillator();const gain=context.createGain();oscillator.connect(gain);gain.connect(context.destination);oscillator.frequency.value=660;gain.gain.setValueAtTime(.12,context.currentTime);gain.gain.exponentialRampToValueAtTime(.001,context.currentTime+.6);oscillator.start();oscillator.stop(context.currentTime+.6)}
 if(options.notifications&&'Notification' in window&&Notification.permission==='granted'){try{new Notification('Focusly: sesión completada',{body:'Buen trabajo. Es momento de hacer una pausa.',icon:'/focusly-favicon-192.png',tag:id})}catch{/* The visual notice remains available. */}}
 setMessage('Sesión completada. Tu esfuerzo cuenta.')
 })},[completed,id,options.notifications,options.sound])
 return {prepare,message}
}
