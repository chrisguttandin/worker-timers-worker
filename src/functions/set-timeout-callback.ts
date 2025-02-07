import { ISetResponse } from '../interfaces';

export const setTimeoutCallback = (
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
