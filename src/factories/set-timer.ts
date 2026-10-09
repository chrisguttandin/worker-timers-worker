import { TResolveSetResponseResultPromise } from '../types';
import type { createSetTimeoutCallback } from './set-timeout-callback';

export const createSetTimer =
    (
        identifiersAndResolvers: Map<number, [number, TResolveSetResponseResultPromise]>,
        performance: Pick<Performance, 'now'>,
        setTimeout: (typeof globalThis)['setTimeout'],
        setTimeoutCallback: ReturnType<typeof createSetTimeoutCallback>
    ) =>
    /*
     * The given nowAndTimeOrigin is intentionally ignored. It is measured with the clock of another context which can't be compared to
     * the clock of the worker. On macOS performance.now() doesn't advance while the computer sleeps. A page which was loaded before the
     * computer slept therefore lags behind a worker which gets created afterwards. When computing the delay based on both clocks each
     * timer would fire immediately. It would fire late if the clocks drift apart the other way around.
     */
    (delay: number, _: number, timerId: number) => {
        const expected = performance.now() + delay;
        const remainingDelay = delay;

        return new Promise((resolve) => {
            identifiersAndResolvers.set(timerId, [
                setTimeout(setTimeoutCallback, remainingDelay, expected, identifiersAndResolvers, resolve, timerId),
                resolve
            ]);
        });
    };
