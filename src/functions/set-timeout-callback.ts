import { TResolveSetResponseResultPromise, TTimerType } from '../types';

export const setTimeoutCallback = (
    identifiersAndResolvers: Map<number, [number, TResolveSetResponseResultPromise]>,
    timerId: number,
    expected: number,
    timerType: TTimerType,
    resolveSetResponseResultPromise: TResolveSetResponseResultPromise
) => {
    const remainingDelay = expected - performance.now();

    if (remainingDelay > 0) {
        identifiersAndResolvers.set(timerId, [
            setTimeout(
                setTimeoutCallback,
                remainingDelay,
                identifiersAndResolvers,
                timerId,
                expected,
                timerType,
                resolveSetResponseResultPromise
            ),
            resolveSetResponseResultPromise
        ]);
    } else {
        identifiersAndResolvers.delete(timerId);
        resolveSetResponseResultPromise(true);
    }
};
