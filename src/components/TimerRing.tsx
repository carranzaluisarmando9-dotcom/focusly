import { t, text } from '../i18n/es-PE'
import { formatTime } from '../utils/timer'
type Props = { remaining: number; progress: number; running: boolean; completed: boolean }
export function TimerRing({remaining, progress, running, completed}: Props) {
 return <div className="timer-ring"><svg viewBox="0 0 300 300" aria-hidden="true"><circle className="ring-track" cx="150" cy="150" r="137"/><circle className="ring-progress" cx="150" cy="150" r="137" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - progress * 100}/></svg><div className="ring-content"><span className="ring-label">{completed ? t("WELL DONE") : running ? t("STAY IN THE MOMENT") : t("TIME TO FOCUS")}</span><span className="time" role="timer" aria-label={text.remaining(formatTime(remaining))}>{formatTime(remaining)}</span><span className="ring-bottom">{completed ? t("Session complete") : t("Breathe. Focus. Begin.")}</span></div></div>
}
