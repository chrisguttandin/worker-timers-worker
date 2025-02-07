import { ISetResponse } from '../interfaces';

export const createClearScheduledTimeout = (scheduledTimeoutIdentifiers: Map<number, [number, number]>) => (timerId: number) => {
    const identifier = scheduledTimeoutIdentifiers.get(timerId);

    if (identifier === undefined) {
        return false;
    }

    clearTimeout(identifier[0]);
    scheduledTimeoutIdentifiers.delete(timerId);

    postMessage(<ISetResponse>{ id: identifier[1], result: null });

    return true;
};
