/*
 * WindowOrWorkerGlobalScope.setTimeout() converts its timeout argument to a WebIDL long which turns NaN, ±Infinity and
 * values beyond 2^31 - 1 into 0 (or into a wrapped around value). A native timer created with such a delay fires right
 * away while the expected time computed from the original value stays out of reach. setTimeoutCallback() would then
 * re-arm a native timer with the same delay indefinitely. Chromium clamps nested timers to at least 4 milliseconds,
 * which turns that into a permanent 4 ms wake-up loop until clearTimeout() is called.
 */
export const MAX_NATIVE_DELAY = 2147483647;

export const sanitizeDelay = (delay: number) => (Number.isFinite(delay) ? Math.max(0, delay) : 0);

export const clampNativeDelay = (delay: number) => Math.min(delay, MAX_NATIVE_DELAY);
