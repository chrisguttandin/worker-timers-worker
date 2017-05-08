const scheduledIntervalIdentifiers: Map<number, number> = new Map();
const scheduledTimeoutIdentifiers: Map<number, number> = new Map();

export const clearScheduledInterval = (id: number) => {
    const identifier = scheduledIntervalIdentifiers.get(id);

    if (identifier !== undefined) {
        clearTimeout(identifier);
        scheduledIntervalIdentifiers.delete(id);
    }
};

export const clearScheduledTimeout = (id: number) => {
    const identifier = scheduledTimeoutIdentifiers.get(id);

    if (identifier !== undefined) {
        clearTimeout(identifier);
        scheduledTimeoutIdentifiers.delete(id);
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

const setTimeoutCallback = (identifiers: Map<number, number>, id: number, expected: number, type: string) => {
    const now = ('performance' in self) ? performance.now() : Date.now();

    if (now > expected) {
        postMessage({ id, type });
    } else {
        identifiers.set(id, setTimeout(setTimeoutCallback, (expected - now), identifiers, id, expected, type));
    }
};

export const scheduleInterval = (delay: number, id: number, nowInMainThread: number) => {
    let expected;

    ({ delay, expected } = computeDelayAndExpectedCallbackTime(delay, nowInMainThread));

    scheduledIntervalIdentifiers.set(
        id, setTimeout(setTimeoutCallback, delay, scheduledIntervalIdentifiers, id, expected, 'interval')
    );
};

export const scheduleTimeout = (delay: number, id: number, nowInMainThread: number) => {
    let expected;

    ({ delay, expected } = computeDelayAndExpectedCallbackTime(delay, nowInMainThread));

    scheduledTimeoutIdentifiers.set(
        id, setTimeout(setTimeoutCallback, delay, scheduledTimeoutIdentifiers, id, expected, 'timeout')
    );
};
