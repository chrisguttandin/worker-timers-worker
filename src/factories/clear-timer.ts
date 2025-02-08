import { TResolveSetResponseResultPromise } from '../types';

export const createClearTimer = (identifiers: Map<number, [number, TResolveSetResponseResultPromise]>) => (timerId: number) => {
    const identifier = identifiers.get(timerId);

    if (identifier === undefined) {
        return false;
    }

    clearTimeout(identifier[0]);
    identifiers.delete(timerId);

    identifier[1](null);

    return true;
};
