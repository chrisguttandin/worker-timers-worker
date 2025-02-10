import { TResolveSetResponseResultPromise, TTimerType } from '../types';

export const setTimeoutCallback = (
    identifiers: Map<number, [number, TResolveSetResponseResultPromise]>,
    timerId: number,
    expected: number,
    timerType: TTimerType,
    resolve: TResolveSetResponseResultPromise
) => {
    const remainingDelay = expected - performance.now();

    if (remainingDelay > 0) {
        identifiers.set(timerId, [
            setTimeout(setTimeoutCallback, remainingDelay, identifiers, timerId, expected, timerType, resolve),
            resolve
        ]);
    } else {
        identifiers.delete(timerId);
        resolve(true);
    }
};
