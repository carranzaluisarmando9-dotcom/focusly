import { useEffect,useRef } from 'react'
import { shortcut } from './model'
export function useShortcuts(actions:{toggle:()=>void;reset:()=>void;new:()=>void},enabled=true){
 const ref=useRef(actions);const active=useRef(enabled)
 useEffect(()=>{ref.current=actions;active.current=enabled},[actions,enabled])
 useEffect(()=>{const handle=(event:KeyboardEvent)=>{if(!active.current)return;const target=event.target;const blocked=!!document.querySelector('dialog[open]')||(target instanceof Element&&!!target.closest('input,textarea,select,button,a,summary,[contenteditable]:not([contenteditable="false"]),[role="button"],[role="textbox"],[role="slider"]'));const action=shortcut(event.key,blocked,event.ctrlKey||event.altKey||event.metaKey||event.shiftKey||event.isComposing,event.repeat);if(action){event.preventDefault();ref.current[action]()}};window.addEventListener('keydown',handle);return()=>window.removeEventListener('keydown',handle)},[])
}
