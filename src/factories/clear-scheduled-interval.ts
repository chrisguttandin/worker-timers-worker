import { ISetResponse } from '../interfaces';

export const createClearScheduledInterval = (scheduledIntervalIdentifiers: Map<number, [number, number]>) => (timerId: number) => {
    const identifier = scheduledIntervalIdentifiers.get(timerId);

    if (identifier === undefined) {
        return false;
    }

    clearTimeout(identifier[0]);
    scheduledIntervalIdentifiers.delete(timerId);

    postMessage(<ISetResponse>{ id: identifier[1], result: null });

    return true;
};
