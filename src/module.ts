import { TWorkerImplementation, createWorker } from 'worker-factory';
import { createClearTimer } from './factories/clear-timer';
import { createComputeDelayAndExpectedCallbackTime } from './factories/compute-delay-and-expected-callback-time';
import { createSetTimeoutCallback } from './factories/set-timeout-callback';
import { createSetTimer } from './factories/set-timer';
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
const computeDelayAndExpectedCallbackTime = createComputeDelayAndExpectedCallbackTime(performance);
const setTimeoutCallback = createSetTimeoutCallback(performance, globalThis.setTimeout);
const setInterval = createSetTimer(
    computeDelayAndExpectedCallbackTime,
    intervalIdentifiersAndResolvers,
    globalThis.setTimeout,
    setTimeoutCallback
);
const setTimeout = createSetTimer(
    computeDelayAndExpectedCallbackTime,
    timeoutIdentifiersAndResolvers,
    globalThis.setTimeout,
    setTimeoutCallback
);

createWorker<IWorkerTimersWorkerCustomDefinition>(self, <TWorkerImplementation<IWorkerTimersWorkerCustomDefinition>>{
    clear: async ({ timerId, timerType }) => {
        return { result: await (timerType === 'interval' ? clearInterval(timerId) : clearTimeout(timerId)) };
    },
    set: async ({ delay, now, timerId, timerType }) => {
        return { result: await (timerType === 'interval' ? setInterval : setTimeout)(delay, now, timerId) };
    }
});
