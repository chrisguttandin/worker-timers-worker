import { ICallNotification } from '../interfaces';

const scheduledIntervalIdentifiers: Map<number, number> = new Map();
const scheduledTimeoutIdentifiers: Map<number, number> = new Map();

export const clearScheduledInterval = (timerId: number) => {
    const identifier = scheduledIntervalIdentifiers.get(timerId);

    if (identifier !== undefined) {
        clearTimeout(identifier);
        scheduledIntervalIdentifiers.delete(timerId);
    } else {
        throw new Error(`There is no interval scheduled with the given id "${ timerId }".`);
    }
};

export const clearScheduledTimeout = (timerId: number) => {
    const identifier = scheduledTimeoutIdentifiers.get(timerId);

    if (identifier !== undefined) {
        clearTimeout(identifier);
        scheduledTimeoutIdentifiers.delete(timerId);
    } else {
        throw new Error(`There is no timeout scheduled with the given id "${ timerId }".`);
    }
};

const computeDelayAndExpectedCallbackTime = (delay: number, nowInMainThread: number) => {
    let now: number;

    if ('performance' in self) {
        const nowInWorker = performance.now();

        const elapsed = Math.max(0, nowInWorker - nowInMainThread);

        delay -= elapsed;
        now = nowInWorker;
    } else {
        now = Date.now();
    }

    const expected = now + delay;

    return { delay, expected };
};

const setTimeoutCallback = (identifiers: Map<number, number>, timerId: number, expected: number, timerType: string) => {
    const now = ('performance' in self) ? performance.now() : Date.now();

    if (now > expected) {
        postMessage(<ICallNotification> { id: null, method: 'call', params: { timerId, timerType } });
    } else {
        identifiers.set(timerId, setTimeout(setTimeoutCallback, (expected - now), identifiers, timerId, expected, timerType));
    }
};

export const scheduleInterval = (delay: number, timerId: number, nowInMainThread: number) => {
    let expected;

    ({ delay, expected } = computeDelayAndExpectedCallbackTime(delay, nowInMainThread));

    scheduledIntervalIdentifiers.set(
        timerId, setTimeout(setTimeoutCallback, delay, scheduledIntervalIdentifiers, timerId, expected, 'interval')
    );
};

export const scheduleTimeout = (delay: number, timerId: number, nowInMainThread: number) => {
    let expected;

    ({ delay, expected } = computeDelayAndExpectedCallbackTime(delay, nowInMainThread));

    scheduledTimeoutIdentifiers.set(
        timerId, setTimeout(setTimeoutCallback, delay, scheduledTimeoutIdentifiers, timerId, expected, 'timeout')
    );
};
