import { TResolveSetResponseResultPromise } from '../types';
import type { createComputeDelayAndExpectedCallbackTime } from './compute-delay-and-expected-callback-time';
import type { createSetTimeoutCallback } from './set-timeout-callback';

export const createSetTimer =
    (
        computeDelayAndExpectedCallbackTime: ReturnType<typeof createComputeDelayAndExpectedCallbackTime>,
        identifiersAndResolvers: Map<number, [number, TResolveSetResponseResultPromise]>,
        setTimeoutCallback: ReturnType<typeof createSetTimeoutCallback>
    ) =>
    (delay: number, nowAndTimeOrigin: number, timerId: number) => {
        const { expected, remainingDelay } = computeDelayAndExpectedCallbackTime(delay, nowAndTimeOrigin);

        return new Promise((resolve) => {
            identifiersAndResolvers.set(timerId, [
                setTimeout(setTimeoutCallback, remainingDelay, expected, identifiersAndResolvers, resolve, timerId),
                resolve
            ]);
        });
    };
