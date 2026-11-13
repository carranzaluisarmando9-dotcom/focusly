import { organizeTasks } from './organization'

import { enhancementText as eText } from '../enhancements/text'

import { t, text, number, formatDate } from '../../i18n/es-PE'

import { useEffect, useState } from 'react'

import { Check,Circle,ClipboardList,Pencil,Plus,Target,Trash2 } from 'lucide-react'

import { createTask,filterTasks,type Filter,type Task } from './model'

import { TaskDialog } from './TaskDialog'

import { TaskForm } from './TaskForm'

import type { useTasks } from './useTasks'

export function TaskPanel({manager,newTaskRequest=0}:{manager:ReturnType<typeof useTasks>;newTaskRequest?:number}) {

 const {tasks,activeId,dispatch,today}=manager

 const [filter,setFilter]=useState<Filter>('All Tasks');const [editor,setEditor]=useState<Task|'new'|null>(null);const [deleting,setDeleting]=useState<Task|null>(null)

 useEffect(()=>{if(newTaskRequest>0)queueMicrotask(()=>setEditor('new'))},[newTaskRequest])

 const [query,setQuery]=useState('');const [tag,setTag]=useState('');const [sort,setSort]=useState('newest')

 const visible=organizeTasks(filterTasks(tasks,filter,today),query,tag,sort);const completed=tasks.filter(t=>t.completed).length

 return <section className="tasks-panel" aria-labelledby="tasks-heading"><div className="tasks-heading"><div><div className="eyebrow">{t("A LITTLE STRUCTURE, MORE CLARITY")}</div><h2 id="tasks-heading">{t("Your tasks")}<span>{number(tasks.length)}</span></h2><p role="status" aria-live="polite">{text.pendingTasks(tasks.length-completed)} · {text.completedTasks(completed)}</p></div><button className="primary-button" onClick={()=>setEditor('new')}><Plus size={16}/> {t("Add task")}</button></div><div className="task-tools"><label>{eText.search}<input type="search" value={query} onChange={e=>setQuery(e.target.value)}/></label><label>{eText.tag}<select value={tag} onChange={e=>setTag(e.target.value)}><option value="">Todas las etiquetas</option>{[...new Set(tasks.flatMap(t=>t.tags??[]))].map(value=><option key={value}>{value}</option>)}</select></label><label>{eText.sort}<select value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">Más recientes</option><option value="priority">Prioridad</option><option value="date">Fecha prevista</option></select></label></div>{manager.canUndo&&<div className="undo-feedback" role="status">Último cambio de tarea disponible para deshacer. <button className="secondary-button" onClick={manager.undoLast}>{eText.undo}</button></div>}<div className="task-filters" aria-label={t("Task filters")}>{(['All Tasks','Today','Pending','Completed'] as Filter[]).map(f=><button key={f} aria-pressed={filter===f} onClick={()=>setFilter(f)}>{t(f)}</button>)}</div><div className="task-list">{visible.length?visible.map(task=><article key={task.id} className={`task-item ${task.completed?'is-completed':''} ${activeId===task.id?'is-active':''}`}><button className="completion-button" aria-label={`${task.completed?t("Reopen"):t("Complete")} ${task.title}`} aria-pressed={task.completed} onClick={()=>dispatch({type:'toggle',id:task.id})}>{task.completed?<Check size={17}/>:<Circle size={19}/>}</button><div className="task-copy"><h3>{task.title}</h3>{task.description&&<p>{task.description}</p>}{(task.subtasks??[]).length>0&&<ul className="subtask-list">{task.subtasks?.map(item=><li key={item.id}><label><input type="checkbox" checked={item.completed} onChange={()=>dispatch({type:"edit",id:task.id,draft:{...task,subtasks:task.subtasks?.map(s=>s.id===item.id?{...s,completed:!s.completed}:s)}})}/>{item.title}</label></li>)}</ul>}<div className="task-meta">{task.tags?.map(tag=><span className="task-tag" key={tag}>#{tag}</span>)}<span className={`priority priority-${task.priority.toLowerCase()}`}>{t(task.priority)}</span>{task.dueDate&&<time dateTime={task.dueDate}>{task.dueDate===today?t('Today'):formatDate(new Date(`${task.dueDate}T12:00:00`),{month:'short',day:'numeric',year:'numeric'})}</time>}{activeId===task.id&&<span className="active-label">{t("Active task")}</span>}</div></div><div className="task-item-actions">{!task.completed&&<button className="icon-button" aria-label={`${activeId===task.id?t("Deselect"):t("Focus on")} ${task.title}`} aria-pressed={activeId===task.id} onClick={()=>dispatch({type:'select',id:activeId===task.id?null:task.id})}><Target size={17}/></button>}<button className="icon-button" aria-label={`${t("Edit")} ${task.title}`} onClick={()=>setEditor(task)}><Pencil size={16}/></button><button className="icon-button delete-button" aria-label={`${t("Delete")} ${task.title}`} onClick={()=>setDeleting(task)}><Trash2 size={16}/></button></div></article>):<div className="tasks-empty"><span><ClipboardList size={27}/></span><h3>{tasks.length?t("A little breathing room."):t("A clear space. A fresh start.")}</h3><p>{tasks.length?t("No tasks in this view. Choose another filter or add a task."):t("Add your first task, then choose it as your focus for the next session.")}</p><button className="secondary-button" onClick={()=>setEditor('new')}><Plus size={15}/> {t("Add a task")}</button></div>}</div><p className="memory-note">{t("Tasks are saved on this device when local storage is available.")}</p>{editor&&<TaskDialog title={editor==='new'?t("Add a task"):t("Edit task")} onClose={()=>setEditor(null)}><TaskForm initial={editor==='new'?undefined:editor} onCancel={()=>setEditor(null)} onSave={draft=>{if(editor==='new')dispatch({type:'create',task:createTask(draft,crypto.randomUUID(),new Date().toISOString())});else dispatch({type:'edit',id:editor.id,draft});setEditor(null)}}/></TaskDialog>}{deleting&&<TaskDialog title={t("Delete this task?")} onClose={()=>setDeleting(null)}><p className="delete-description">{text.deletion(deleting.title)}</p><div className="dialog-actions"><button data-initial-focus className="secondary-button" onClick={()=>setDeleting(null)}>{t("Keep task")}</button><button className="danger-button" onClick={()=>{dispatch({type:'delete',id:deleting.id});setDeleting(null)}}>{t("Delete task")}</button></div></TaskDialog>}</section>

}
