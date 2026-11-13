import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { defineConfig,type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// Precache the built shell and hashed assets, without external runtime dependencies.
function offlineShell():Plugin {
 return {name:'focusly-offline',apply:'build',generateBundle(_options,bundle){
 const files=['./','./index.html','./focusly-favicon.svg','./focusly-logo.svg','./focusly-logo-dark.svg','./manifest.webmanifest','./focusly-favicon-192.png','./focusly-favicon-512.png',...Object.keys(bundle).filter(file=>file.startsWith('assets/')).map(file=>`./${file}`)]
 const digest=createHash('sha256').update(Object.keys(bundle).join('|')).update(readFileSync(new URL('./index.html',import.meta.url)))
 for(const file of ['manifest.webmanifest','focusly-logo.svg','focusly-logo-dark.svg','focusly-favicon.svg','focusly-favicon-192.png','focusly-favicon-512.png'])digest.update(readFileSync(new URL(`./public/${file}`,import.meta.url)))
 const version=digest.digest('hex').slice(0,20)
 this.emitFile({type:'asset',fileName:'sw.js',source:`
const CACHE='focusly-shell-'+${JSON.stringify(version)};
const FILES=${JSON.stringify(files)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('focusly-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 event.respondWith(caches.match(event.request,{ignoreVary:true}).then(cached=>cached||fetch(event.request).catch(()=>event.request.mode==='navigate'?caches.match('./index.html',{ignoreVary:true}):Response.error())));
});`})
 }}
}
export default defineConfig({plugins:[react(),tailwindcss(),offlineShell()]})
