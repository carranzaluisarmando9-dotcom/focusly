import { t } from '../i18n/es-PE'
export type Mode = 'focus' | 'short' | 'long'
export const MODES: Record<Mode, { label: string; duration: number; description: string }> = {
  focus: { label: t("Focus"), duration: 25 * 60_000, description: t("One thing at a time. You’ve got this.") },
  short: { label: t("Short Break"), duration: 5 * 60_000, description: t("Step back, stretch, and take a breath.") },
  long: { label: t("Long Break"), duration: 15 * 60_000, description: t("Give your mind a little room to recharge.") },
}
export function remainingAt(deadline: number, now: number): number { return Math.max(0, deadline - now) }
export function formatTime(ms: number): string { const seconds = Math.ceil(Math.max(0, ms) / 1000); return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}` }
export function progressOf(remaining: number, duration: number): number { return duration <= 0 ? 0 : Math.min(1, Math.max(0, 1 - remaining / duration)) }
