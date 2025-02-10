import type { computeDelayAndExpectedCallbackTime as computeDelayAndExpectedCallbackTimeFunction } from '../functions/compute-delay-and-expected-callback-time';
import type { setTimeoutCallback as setTimeoutCallbackFunction } from '../functions/set-timeout-callback';
import { TResolveSetResponseResultPromise, TTimerType } from '../types';

export const createScheduleTimeout =
    (
        computeDelayAndExpectedCallbackTime: typeof computeDelayAndExpectedCallbackTimeFunction,
        scheduledTimeoutIdentifiersAndResolvers: Map<number, [number, TResolveSetResponseResultPromise]>,
        setTimeoutCallback: typeof setTimeoutCallbackFunction
    ) =>
    (delay: number, timerId: number, timerType: TTimerType, nowAndTimeOrigin: number) => {
        const { expected, remainingDelay } = computeDelayAndExpectedCallbackTime(delay, nowAndTimeOrigin);

        return new Promise((resolve) => {
            scheduledTimeoutIdentifiersAndResolvers.set(timerId, [
                setTimeout(
                    setTimeoutCallback,
                    remainingDelay,
                    scheduledTimeoutIdentifiersAndResolvers,
                    timerId,
                    expected,
                    timerType,
                    resolve
                ),
                resolve
            ]);
        });
    };
