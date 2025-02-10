import { TResolveSetResponseResultPromise, TTimerType } from '../types';

export const setTimeoutCallback = (
    expected: number,
    identifiersAndResolvers: Map<number, [number, TResolveSetResponseResultPromise]>,
    resolveSetResponseResultPromise: TResolveSetResponseResultPromise,
    timerId: number,
    timerType: TTimerType
) => {
    const remainingDelay = expected - performance.now();

    if (remainingDelay > 0) {
        identifiersAndResolvers.set(timerId, [
            setTimeout(
                setTimeoutCallback,
                remainingDelay,
                expected,
                identifiersAndResolvers,
                resolveSetResponseResultPromise,
                timerId,
                timerType
            ),
            resolveSetResponseResultPromise
        ]);
    } else {
        identifiersAndResolvers.delete(timerId);
        resolveSetResponseResultPromise(true);
    }
};
