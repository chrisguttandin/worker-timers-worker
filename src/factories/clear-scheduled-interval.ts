import { TResolveSetResponseResultPromise } from '../types';

export const createClearScheduledInterval =
    (scheduledIntervalIdentifiers: Map<number, [number, TResolveSetResponseResultPromise]>) => (timerId: number) => {
        const identifier = scheduledIntervalIdentifiers.get(timerId);

        if (identifier === undefined) {
            return false;
        }

        clearTimeout(identifier[0]);
        scheduledIntervalIdentifiers.delete(timerId);

        identifier[1](null);

        return true;
    };
