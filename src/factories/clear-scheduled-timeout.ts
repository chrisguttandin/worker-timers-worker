import { TResolveSetResponseResultPromise } from '../types';

export const createClearScheduledTimeout =
    (scheduledTimeoutIdentifiers: Map<number, [number, TResolveSetResponseResultPromise]>) => (timerId: number) => {
        const identifier = scheduledTimeoutIdentifiers.get(timerId);

        if (identifier === undefined) {
            return false;
        }

        clearTimeout(identifier[0]);
        scheduledTimeoutIdentifiers.delete(timerId);

        identifier[1](null);

        return true;
    };
