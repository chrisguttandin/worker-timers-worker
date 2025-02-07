import type { computeDelayAndExpectedCallbackTime as computeDelayAndExpectedCallbackTimeFunction } from '../functions/compute-delay-and-expected-callback-time';
import type { setTimeoutCallback as setTimeoutCallbackFunction } from '../functions/set-timeout-callback';
import { TResolveSetResponseResultPromise } from '../types';

export const createScheduleTimeout =
    (
        computeDelayAndExpectedCallbackTime: typeof computeDelayAndExpectedCallbackTimeFunction,
        scheduledTimeoutIdentifiers: Map<number, [number, TResolveSetResponseResultPromise]>,
        setTimeoutCallback: typeof setTimeoutCallbackFunction
    ) =>
    (delay: number, timerId: number, nowAndTimeOrigin: number) => {
        const { expected, remainingDelay } = computeDelayAndExpectedCallbackTime(delay, nowAndTimeOrigin);

        return new Promise((resolve) => {
            scheduledTimeoutIdentifiers.set(timerId, [
                setTimeout(setTimeoutCallback, remainingDelay, scheduledTimeoutIdentifiers, timerId, expected, 'timeout', resolve),
                resolve
            ]);
        });
    };
