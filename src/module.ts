import { IWorkerTimersEvent } from './interfaces/worker-timers-event';

export { IWorkerTimersEvent };

const scheduledIntervalIdentifiers: Map<number, number> = new Map();
const scheduledTimeoutIdentifiers: Map<number, number> = new Map();

const setTimeoutCallback = (identifiers: Map<number, number>, id: number, expected: number, type: string) => {
    const now = ('performance' in self) ? performance.now() : Date.now();

    if (now > expected) {
        postMessage({ id, type });
    } else {
        identifiers.set(id, setTimeout(setTimeoutCallback, (expected - now), identifiers, id, expected, type));
    }
};

addEventListener('message', ({ data: { action, delay, id, now: nowInMainThread, type } }: IWorkerTimersEvent) => {
    if (action === 'clear') {
        let identifier;

        if (type === 'interval') {
            identifier = scheduledIntervalIdentifiers.get(id);

            if (identifier !== undefined) {
                clearTimeout(identifier);
                scheduledIntervalIdentifiers.delete(id);
            }

        } else if (type === 'timeout') {
            identifier = scheduledTimeoutIdentifiers.get(id);

            if (identifier !== undefined) {
                clearTimeout(identifier);
                scheduledTimeoutIdentifiers.delete(id);
            }
        }

        // @todo Maybe throw an error.
    } else if (action === 'set') {
        let now;

        if ('performance' in self) {
            const nowInWorker = performance.now();

            const elapsed = Math.max(0, nowInWorker - nowInMainThread);

            delay -= elapsed;
            now = nowInWorker;
        } else {
            now = Date.now();
        }

        const expected = now + delay;

        if (type === 'interval') {
            scheduledIntervalIdentifiers.set(
                id, setTimeout(setTimeoutCallback, delay, scheduledIntervalIdentifiers, id, expected, type)
            );
        } else if (type === 'timeout') {
            scheduledTimeoutIdentifiers.set(
                id, setTimeout(setTimeoutCallback, delay, scheduledTimeoutIdentifiers, id, expected, type)
            );
        }

        // @todo Maybe throw an error.
    }

    // @todo Maybe throw an error.
});
