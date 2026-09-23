import { clampNativeDelay, sanitizeDelay } from '../functions/sanitize-delay';
import { TResolveSetResponseResultPromise } from '../types';
import type { createSetTimeoutCallback } from './set-timeout-callback';

export const createSetTimer =
    (
        identifiersAndResolvers: Map<number, [number, TResolveSetResponseResultPromise]>,
        performance: Pick<Performance, 'now'>,
        setTimeout: (typeof globalThis)['setTimeout'],
        setTimeoutCallback: ReturnType<typeof createSetTimeoutCallback>
    ) =>
    (delay: number, timerId: number) => {
        /*
         * The expected time is derived from the clock of the worker only. Combining performance.timeOrigin and
         * performance.now() of the main thread with those of the worker is allowed by the HR Time spec but the monotonic
         * clock does not tick during system sleep in Chromium (macOS, Linux), Gecko and WebKit. The two sums drift apart
         * once the system slept and every timer would fire immediately (see chrisguttandin/worker-timers#446). The
         * latency of the message which set the timer is ignored on purpose. It is far below the granularity of setTimeout().
         */
        const remainingDelay = sanitizeDelay(delay);
        const expected = performance.now() + remainingDelay;

        return new Promise((resolve) => {
            identifiersAndResolvers.set(timerId, [
                setTimeout(setTimeoutCallback, clampNativeDelay(remainingDelay), expected, identifiersAndResolvers, resolve, timerId),
                resolve
            ]);
        });
    };
