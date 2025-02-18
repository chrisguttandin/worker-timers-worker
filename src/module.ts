import { TWorkerImplementation, createWorker } from 'worker-factory';
import { createClearTimer } from './factories/clear-timer';
import { createSetTimer } from './factories/set-timer';
import { computeDelayAndExpectedCallbackTime } from './functions/compute-delay-and-expected-callback-time';
import { setTimeoutCallback } from './functions/set-timeout-callback';
import { IWorkerTimersWorkerCustomDefinition } from './interfaces';
import { TResolveSetResponseResultPromise } from './types';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

const intervalIdentifiersAndResolvers: Map<number, [number, TResolveSetResponseResultPromise]> = new Map();
const clearInterval = createClearTimer(intervalIdentifiersAndResolvers);
const timeoutIdentifiersAndResolvers: Map<number, [number, TResolveSetResponseResultPromise]> = new Map();
const clearTimeout = createClearTimer(timeoutIdentifiersAndResolvers);
const setInterval = createSetTimer(computeDelayAndExpectedCallbackTime, intervalIdentifiersAndResolvers, setTimeoutCallback);
const setTimeout = createSetTimer(computeDelayAndExpectedCallbackTime, timeoutIdentifiersAndResolvers, setTimeoutCallback);

createWorker<IWorkerTimersWorkerCustomDefinition>(self, <TWorkerImplementation<IWorkerTimersWorkerCustomDefinition>>{
    clear: async ({ timerId, timerType }) => {
        return { result: await (timerType === 'interval' ? clearInterval(timerId) : clearTimeout(timerId)) };
    },
    set: async ({ delay, now, timerId, timerType }) => {
        return { result: await (timerType === 'interval' ? setInterval : setTimeout)(delay, now, timerId) };
    }
});
