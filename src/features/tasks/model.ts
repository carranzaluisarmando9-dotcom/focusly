import { t } from '../../i18n/es-PE'

export type Priority = 'High' | 'Medium' | 'Low'

export type Subtask = { id:string; title:string; completed:boolean }

export type Draft = { tags?:string[]; subtasks?:Subtask[]; title: string; description: string; priority: Priority; dueDate: string }

export type Task = Draft & { id: string; createdAt: string; completed: boolean }

export type State = { tasks: Task[]; activeId: string | null }

export type Filter = 'All Tasks' | 'Today' | 'Pending' | 'Completed'

export type Action = { type: 'create'; task: Task } | { type: 'edit'; id: string; draft: Draft } | { type: 'toggle' | 'delete'; id: string } | { type: 'select'; id: string | null }

export const emptyDraft: Draft = { title: '', description: '', priority: 'Medium', dueDate: '' }

export function localDate(date: Date): string { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}` }

export function validate(draft: Draft): string | null {

 if(draft.tags && (draft.tags.length>10||draft.tags.some(tag=>!tag.trim()||tag.length>30)))return 'Usa como máximo 10 etiquetas de hasta 30 caracteres.'

 if(draft.subtasks && (draft.subtasks.length>30||draft.subtasks.some(item=>!item.id||!item.title.trim()||item.title.length>100)||new Set(draft.subtasks.map(item=>item.id)).size!==draft.subtasks.length))return 'Usa hasta 30 subtareas con títulos de 1 a 100 caracteres.'

 if (!draft.title.trim()) return t("Please enter a task title.")

 if (draft.title.length > 100) return t("Title must be 100 characters or fewer.")

 if (draft.description.length > 500) return t("Description must be 500 characters or fewer.")

 if (!['High','Medium','Low'].includes(draft.priority)) return t("Choose a valid priority.")

 if (draft.dueDate && (!/^\d{4}-\d{2}-\d{2}$/.test(draft.dueDate) || Number.isNaN(new Date(`${draft.dueDate}T12:00:00`).getTime()) || localDate(new Date(`${draft.dueDate}T12:00:00`)) !== draft.dueDate)) return t("Choose a valid date.")

 return null

}

export function createTask(draft: Draft, id: string, createdAt: string): Task { const error=validate(draft); if(error) throw new Error(error); return {...draft,title:draft.title.trim(),id,createdAt,completed:false} }

export function filterTasks(tasks: Task[], filter: Filter, today: string): Task[] { return tasks.filter(t=> filter==='Today'?t.dueDate===today:filter==='Pending'?!t.completed:filter==='Completed'?t.completed:true) }

export function reducer(state: State, action: Action): State {

 let tasks=state.tasks; let activeId=state.activeId

 switch(action.type){

 case 'create': if(validate(action.task)||tasks.some(t=>t.id===action.task.id))return state; tasks=[...tasks,action.task];break

 case 'edit': if(validate(action.draft))return state;tasks=tasks.map(t=>t.id===action.id?{...t,...action.draft,title:action.draft.title.trim()}:t);break

 case 'toggle':tasks=tasks.map(t=>t.id===action.id?{...t,completed:!t.completed}:t);break

 case 'delete':tasks=tasks.filter(t=>t.id!==action.id);break

 case 'select':activeId=action.id;break

 }

 if(!tasks.some(t=>t.id===activeId&&!t.completed))activeId=null

 return {tasks,activeId}

}
