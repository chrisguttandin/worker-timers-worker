import type { computeDelayAndExpectedCallbackTime as computeDelayAndExpectedCallbackTimeFunction } from '../functions/compute-delay-and-expected-callback-time';
import type { createSetTimeoutCallback } from './set-timeout-callback';
import { TResolveSetResponseResultPromise } from '../types';

export const createSetTimer =
    (
        computeDelayAndExpectedCallbackTime: typeof computeDelayAndExpectedCallbackTimeFunction,
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
