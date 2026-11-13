import { useEffect, useState } from 'react'
type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }
export function InstallApp() {
 const [prompt, setPrompt] = useState<InstallPrompt | null>(null)
 const [status, setStatus] = useState('')
 useEffect(() => {
  const install = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPrompt) }
  const installed = () => { setPrompt(null); setStatus('Focusly está instalada.') }
  window.addEventListener('beforeinstallprompt', install)
  window.addEventListener('appinstalled', installed)
  return () => { window.removeEventListener('beforeinstallprompt', install); window.removeEventListener('appinstalled', installed) }
 }, [])
 const install = async () => {
  if (!prompt) return
  try { await prompt.prompt(); const choice = await prompt.userChoice; setStatus(choice.outcome === 'accepted' ? 'Instalación solicitada.' : 'Puedes instalarla más adelante.'); setPrompt(null) }
  catch { setStatus('Usa la opción de instalación del menú del navegador.') }
 }
 return <section className="productivity-panel"><h2>Focusly en tu dispositivo</h2><p className="section-description">Instala la aplicación desde el menú del navegador. En iPhone o iPad, usa Compartir → Añadir a pantalla de inicio. Una primera visita con conexión prepara el uso sin internet.</p>{prompt && <button className="primary-button" onClick={install}>Instalar Focusly</button>}<p role="status">{status}</p></section>
}
