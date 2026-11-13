import { t } from '../../i18n/es-PE'
import { useEffect,useRef,type ReactNode } from 'react'
import { X } from 'lucide-react'
export function TaskDialog({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode}) {
 const ref=useRef<HTMLDialogElement>(null)
 useEffect(()=>{const dialog=ref.current;const previous=document.activeElement;dialog?.showModal();dialog?.querySelector<HTMLElement>('[data-initial-focus], input:not([type=hidden]), textarea, select')?.focus();return()=>{dialog?.close();if(previous instanceof HTMLElement)previous.focus()}},[])
 return <dialog ref={ref} className="task-dialog" aria-labelledby="dialog-title" onCancel={onClose}><div className="dialog-heading"><h2 id="dialog-title">{title}</h2><button className="icon-button" aria-label={t("Close dialog")} onClick={onClose}><X size={18}/></button></div>{children}</dialog>
}
