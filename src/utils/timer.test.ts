import { describe, expect, it } from 'vitest'
import { formatTime, remainingAt, progressOf, MODES } from './timer'
describe('timer calculations', () => {
 it('uses elapsed wall time even after background delays', () => { expect(remainingAt(100000, 97000)).toBe(3000); expect(remainingAt(100000, 130000)).toBe(0) })
 it('formats and rounds remaining seconds', () => { expect(formatTime(1500000)).toBe('25:00'); expect(formatTime(1)).toBe('00:01'); expect(formatTime(-1)).toBe('00:00'); expect(formatTime(60000)).toBe('01:00') })
 it('clamps progress', () => { expect(progressOf(50, 100)).toBe(.5); expect(progressOf(-1, 100)).toBe(1); expect(progressOf(200, 100)).toBe(0); expect(progressOf(0, 0)).toBe(0) })
 it('defines requested durations', () => { expect(Object.values(MODES).map(m => m.duration / 60000)).toEqual([25, 5, 15]) })
})
