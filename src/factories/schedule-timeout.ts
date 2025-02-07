import type { computeDelayAndExpectedCallbackTime as computeDelayAndExpectedCallbackTimeFunction } from '../functions/compute-delay-and-expected-callback-time';
import type { setTimeoutCallback as setTimeoutCallbackFunction } from '../functions/set-timeout-callback';

export const createScheduleTimeout =
    (
        computeDelayAndExpectedCallbackTime: typeof computeDelayAndExpectedCallbackTimeFunction,
        scheduledTimeoutIdentifiers: Map<number, [number, number]>,
        setTimeoutCallback: typeof setTimeoutCallbackFunction
    ) =>
    (delay: number, id: number, timerId: number, nowAndTimeOrigin: number) => {
        const { expected, remainingDelay } = computeDelayAndExpectedCallbackTime(delay, nowAndTimeOrigin);

        scheduledTimeoutIdentifiers.set(timerId, [
            setTimeout(setTimeoutCallback, remainingDelay, id, scheduledTimeoutIdentifiers, timerId, expected, 'timeout'),
            id
        ]);
    };
