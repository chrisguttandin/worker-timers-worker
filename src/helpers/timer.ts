import { ICallNotification } from '../interfaces';

const scheduledIntervalIdentifiers: Map<number, number> = new Map();
const scheduledTimeoutIdentifiers: Map<number, number> = new Map();

export const clearScheduledInterval = (timerId: number) => {
    const identifier = scheduledIntervalIdentifiers.get(timerId);

    if (identifier === undefined) {
        return false;
    }

    clearTimeout(identifier);
    scheduledIntervalIdentifiers.delete(timerId);

    return true;
};

export const clearScheduledTimeout = (timerId: number) => {
    const identifier = scheduledTimeoutIdentifiers.get(timerId);

    if (identifier === undefined) {
        return false;
    }

    clearTimeout(identifier);
    scheduledTimeoutIdentifiers.delete(timerId);

    return true;
};

const computeDelayAndExpectedCallbackTime = (delay: number, nowAndTimeOrigin: number) => {
    const now = performance.now();
    const remainingDelay = delay + nowAndTimeOrigin - now - performance.timeOrigin;
    const expected = now + remainingDelay;

    return { expected, remainingDelay };
};

const setTimeoutCallback = (identifiers: Map<number, number>, timerId: number, expected: number, timerType: string) => {
    const remainingDelay = expected - performance.now();

    if (remainingDelay > 0) {
        identifiers.set(timerId, setTimeout(setTimeoutCallback, remainingDelay, identifiers, timerId, expected, timerType));
    } else {
        identifiers.delete(timerId);
        postMessage(<ICallNotification>{ id: null, method: 'call', params: { timerId, timerType } });
    }
};

export const scheduleInterval = (delay: number, timerId: number, nowAndTimeOrigin: number) => {
    const { expected, remainingDelay } = computeDelayAndExpectedCallbackTime(delay, nowAndTimeOrigin);

    scheduledIntervalIdentifiers.set(
        timerId,
        setTimeout(setTimeoutCallback, remainingDelay, scheduledIntervalIdentifiers, timerId, expected, 'interval')
    );
};

export const scheduleTimeout = (delay: number, timerId: number, nowAndTimeOrigin: number) => {
    const { expected, remainingDelay } = computeDelayAndExpectedCallbackTime(delay, nowAndTimeOrigin);

    scheduledTimeoutIdentifiers.set(
        timerId,
        setTimeout(setTimeoutCallback, remainingDelay, scheduledTimeoutIdentifiers, timerId, expected, 'timeout')
    );
};
