import { useOptions } from './features/enhancements/options'

import { useFocusMode } from './features/enhancements/useFocusMode'

import { useCompletionNotice } from './features/enhancements/useCompletionNotice'

import { BackupPanel } from './features/enhancements/BackupPanel'

import { OptionsPanel } from './features/enhancements/OptionsPanel'

import { InsightsPanel } from './features/enhancements/InsightsPanel'

import { InstallApp } from './features/enhancements/InstallApp'

import { enhancementText as eText } from './features/enhancements/text'

import { t, text } from './i18n/es-PE'

import { useState } from 'react'

import { useTheme } from './features/preferences/useTheme'

import { useShortcuts } from './features/preferences/useShortcuts'

import { useProductivity } from './features/productivity/useProductivity'

import { StatisticsPanel } from './features/productivity/StatisticsPanel'

import { SettingsPanel } from './features/productivity/SettingsPanel'

import { TaskPanel } from './features/tasks/TaskPanel'

import { useTasks } from './features/tasks/useTasks'

import { CircleCheck, Coffee, Play, Pause, RotateCcw, Sparkles, Target, ArrowUpRight } from 'lucide-react'

import { useTimer } from './hooks/useTimer'

import { MODES, progressOf, type Mode } from './utils/timer'

import { TimerRing } from './components/TimerRing'

export default function App() {

 const preferences = useOptions()

 const focus = useFocusMode()

 const theme = useTheme()

 const [newTaskRequest, requestNewTask] = useState(0)

 const productivity = useProductivity()

 const tasks = useTasks(productivity.data.tasks, productivity.setTasks)

 const timer = useTimer(productivity.data.settings, tasks.activeTask, productivity.record, preferences.options)

 const notice=useCompletionNotice(timer.sessionId,timer.completed,preferences.options)

 const startTimer=()=>{notice.prepare();timer.start()}

 useShortcuts({toggle: timer.running ? timer.pause : startTimer, reset: timer.reset, new: () => requestNewTask(n => n + 1)}, preferences.options.shortcuts)

 const mode = {...MODES[timer.mode],duration:timer.duration}

 return <div className={`app-shell ${focus.focused?"focus-mode":""}`}><a className="skip-link" href="#main">{t("Skip to main content")}</a>

  <header className="flex items-center justify-between"><a className="brand" href="#main" aria-label="Focusly"><img className="brand-logo" src={`${import.meta.env.BASE_URL}focusly-logo.svg`} alt="" width="168" height="50"/><img className="brand-logo brand-logo-dark" src={`${import.meta.env.BASE_URL}focusly-logo-dark.svg`} alt="" width="168" height="50"/></a><span className="header-caption">{t("A little focus. A lot of possibility.")}</span><span className="phase-badge"><span/> {t("Your personal focus space")}</span></header>

  <nav className="main-navigation" aria-label={t("Main navigation")}><a href="#focus">{t("Focus")}</a><a href="#tasks">{t("Tasks")}</a><a href="#statistics">{t("Statistics")}</a><a href="#settings">{t("Settings")}</a></nav><main id="main" tabIndex={-1}>{productivity.error && <p role="alert" className="storage-warning">{productivity.error}</p>}

   <div className="intro"><div className="eyebrow"><Sparkles size={14}/> {t("MAKE ROOM FOR WHAT MATTERS")}</div><h1>{t("Find your flow.")}</h1><p>{t("Clear the noise. Set your intention. Make time for meaningful work.")}</p></div>

   <section id="focus" className="workspace" aria-label={t("Focus timer")}>

    <div className="timer-panel"><div className="focus-controls"><button className="secondary-button" aria-pressed={focus.focused} onClick={()=>focus.setFocused(!focus.focused)}>{focus.focused?eText.exitFocus:eText.focusMode}</button><button className="secondary-button" onClick={focus.toggleFullscreen}>{focus.fullscreen?eText.exitFullscreen:eText.fullscreen}</button></div>{(timer.error||focus.error)&&<p role="alert" className="storage-warning">{timer.error||focus.error}</p>}<div className="panel-heading"><span><span className="live-dot"/> {t("FOCUS SPACE")}</span><span className="quiet-label">{t("One session. One intention.")}</span></div>

     <div className="mode-selector" aria-label={t("Timer mode")}>{(Object.keys(MODES) as Mode[]).map(key => <button key={key} aria-pressed={timer.mode === key} onClick={() => timer.selectMode(key)}>{MODES[key].label}</button>)}</div>

     <div className="active-task-banner"><Target size={15}/><div><span>{t("ACTIVE TASK")}</span><p>{tasks.activeTask?.title ?? t("Choose a pending task for this session.")}</p></div>{tasks.activeTask && <button className="icon-button" aria-label={t("Clear active task")} onClick={() => tasks.dispatch({type:'select',id:null})}>×</button>}</div><TimerRing remaining={timer.remaining} progress={progressOf(timer.remaining, mode.duration)} running={timer.running} completed={timer.completed}/>

     <p className="timer-description">{mode.description}</p>

     <div className="timer-actions"><button className="start-button" disabled={timer.completed} onClick={timer.running ? timer.pause : startTimer}>{timer.running ? <Pause size={18}/> : <Play size={18}/>} {timer.running ? t("Pause") : timer.remaining < mode.duration && !timer.completed ? t("Resume") : t("Start")}{!timer.running && text.sessionSuffix}</button><button className="reset-button" onClick={timer.reset} aria-label={t("Reset timer")}><RotateCcw size={19}/><span>{t("Reset")}</span></button></div>

     {timer.completed&&timer.sessionId&&<button className="secondary-button next-session" onClick={()=>timer.advance(timer.sessionId!)}>{timer.mode==="focus"?"Preparar descanso":"Preparar concentración"}</button>}<p role="status" className="completion-notice">{notice.message}</p><div className="session-status" role="status">{timer.completed ? <><CircleCheck size={16}/> {t("Session complete. Take a moment for yourself. Reset or choose a mode to continue.")}</> : <><span className={timer.running ? 'status-dot active' : 'status-dot'}/>{timer.running ? t("In progress — this time is yours") : timer.remaining < mode.duration ? t("Paused — ready when you are") : t("Ready when you are")}</>}</div>

    </div>

    <aside className="flex flex-col gap-5"><div className="intention-card"><span className="small-icon"><Target size={22}/></span><div className="eyebrow">{t("A MOMENT OF INTENTION")}</div><h2>{t("Small steps.")}<br/>{t("Meaningful progress.")}</h2><p>{t("You don’t need to do everything.")}<br/>{t("Just give the next thing your full attention.")}</p><div className="card-line"/><span className="card-note">{text.nextMinutes(mode.duration / 60000)}</span><div className="duration-note">{timer.mode === 'focus' ? t("Dedicated to deep work") : t("A well-deserved pause")}<ArrowUpRight size={17}/></div></div>

    <div className="tip-card"><Coffee size={21}/><div><h3>{t("A gentle reminder")}</h3><p>{timer.mode === 'focus' ? t("Silence notifications, grab some water, and settle into your space.") : t("Look away from your screen. Move a little and let your mind wander.")}</p></div></div></aside>

   </section>

   <div id="tasks"><TaskPanel manager={tasks} newTaskRequest={newTaskRequest}/></div><StatisticsPanel history={productivity.data.history} completedTasks={tasks.tasks.filter(task=>task.completed).length} today={tasks.today}/><InsightsPanel history={productivity.data.history} goal={preferences.options.dailyGoal} today={tasks.today}/><SettingsPanel settings={productivity.data.settings} onSave={productivity.setSettings} theme={theme.theme} onThemeChange={theme.select} themeError={theme.error}/><OptionsPanel key={JSON.stringify(preferences.options)} options={preferences.options} onSave={preferences.save} message={preferences.error}/><BackupPanel data={productivity.data} options={preferences.options} theme={theme.theme} onImport={productivity.importData} onSettings={productivity.setSettings} onOptions={preferences.save} onTheme={theme.select}/><InstallApp/><p className="shortcut-help"><span>{t("Keyboard shortcuts")}</span><kbd>{t("Space")}</kbd> {t("Start / pause")} <kbd>R</kbd> {t("Reset")} <kbd>N</kbd> {t("New task")} <kbd>Esc</kbd> {t("Close dialog")}</p><div className="method-note"><span className="method-icon"><img src={`${import.meta.env.BASE_URL}focusly-favicon.svg`} alt="" width="22" height="22"/></span><p><strong>{t("A simple rhythm for better work.")}</strong> {t("Choose a focus session, then make space for a break.")}<br className="desktop-break"/> {t("Set your own rhythm in Settings.")}</p></div>

  </main><footer><span>{t("Focus. Work. Achieve.")}</span><span>{t("Made for a more intentional day")} <span className="footer-flower">âœ³</span></span></footer>

 </div>

}
