import { describe,it,expect } from 'vitest'
import { readTheme,saveTheme,resolveTheme,shortcut } from './model'
describe('appearance preferences',()=>{
 it('resolves light, dark and automatic themes',()=>{expect(resolveTheme('light',true)).toBe('light');expect(resolveTheme('dark',false)).toBe('dark');expect(resolveTheme('system',true)).toBe('dark');expect(resolveTheme('system',false)).toBe('light')})
 it('persists preferences separately from previous productivity data',()=>{let saved='';const storage={getItem:()=>saved,setItem:(_k:string,v:string)=>{saved=v}};expect(readTheme(storage)).toBe('system');expect(saveTheme(storage,'dark')).toBe(true);expect(readTheme(storage)).toBe('dark')})
 it('uses system for invalid, absent or blocked storage',()=>{expect(readTheme({getItem:()=>null})).toBe('system');expect(readTheme({getItem:()=>'{bad'})).toBe('system');expect(readTheme({getItem:()=>{throw Error()}})).toBe('system');expect(saveTheme({setItem:()=>{throw Error()}},'dark')).toBe(false)})
})
describe('keyboard shortcuts',()=>{
 it('maps the supported keys',()=>{expect(shortcut(' ',false,false,false)).toBe('toggle');expect(shortcut('r',false,false,false)).toBe('reset');expect(shortcut('N',false,false,false)).toBe('new');expect(shortcut('x',false,false,false)).toBeNull()})
 it('ignores blocked targets, modifier combinations and held keys',()=>{for(const key of [' ','r','n']){expect(shortcut(key,true,false,false)).toBeNull();expect(shortcut(key,false,true,false)).toBeNull();expect(shortcut(key,false,false,true)).toBeNull()}})
})
