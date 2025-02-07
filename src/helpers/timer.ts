import { ISetResponse } from '../interfaces';

const scheduledIntervalIdentifiers: Map<number, [number, number]> = new Map();
const scheduledTimeoutIdentifiers: Map<number, [number, number]> = new Map();

export const clearScheduledInterval = (timerId: number) => {
    const identifier = scheduledIntervalIdentifiers.get(timerId);

    if (identifier === undefined) {
        return false;
    }

    clearTimeout(identifier[0]);
    scheduledIntervalIdentifiers.delete(timerId);

    postMessage(<ISetResponse>{ id: identifier[1], result: null });

    return true;
};

export const clearScheduledTimeout = (timerId: number) => {
    const identifier = scheduledTimeoutIdentifiers.get(timerId);

    if (identifier === undefined) {
        return false;
    }

    clearTimeout(identifier[0]);
    scheduledTimeoutIdentifiers.delete(timerId);

    postMessage(<ISetResponse>{ id: identifier[1], result: null });

    return true;
};

const computeDelayAndExpectedCallbackTime = (delay: number, nowAndTimeOrigin: number) => {
    const now = performance.now();
    const remainingDelay = delay + nowAndTimeOrigin - now - performance.timeOrigin;
    const expected = now + remainingDelay;

    return { expected, remainingDelay };
};

const setTimeoutCallback = (
    id: number,
    identifiers: Map<number, [number, number]>,
    timerId: number,
    expected: number,
    timerType: string
) => {
    const remainingDelay = expected - performance.now();

    if (remainingDelay > 0) {
        identifiers.set(timerId, [setTimeout(setTimeoutCallback, remainingDelay, identifiers, timerId, expected, timerType), id]);
    } else {
        identifiers.delete(timerId);
        postMessage(<ISetResponse>{ id, result: { timerId, timerType } });
    }
};

export const scheduleInterval = (delay: number, id: number, timerId: number, nowAndTimeOrigin: number) => {
    const { expected, remainingDelay } = computeDelayAndExpectedCallbackTime(delay, nowAndTimeOrigin);

    scheduledIntervalIdentifiers.set(timerId, [
        setTimeout(setTimeoutCallback, remainingDelay, id, scheduledIntervalIdentifiers, timerId, expected, 'interval'),
        id
    ]);
};

export const scheduleTimeout = (delay: number, id: number, timerId: number, nowAndTimeOrigin: number) => {
    const { expected, remainingDelay } = computeDelayAndExpectedCallbackTime(delay, nowAndTimeOrigin);

    scheduledTimeoutIdentifiers.set(timerId, [
        setTimeout(setTimeoutCallback, remainingDelay, id, scheduledTimeoutIdentifiers, timerId, expected, 'timeout'),
        id
    ]);
};
