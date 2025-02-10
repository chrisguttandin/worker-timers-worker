import { TWorkerImplementation, createWorker } from 'worker-factory';
import { createClearTimer } from './factories/clear-timer';
import { createScheduleInterval } from './factories/schedule-interval';
import { createScheduleTimeout } from './factories/schedule-timeout';
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
const scheduleInterval = createScheduleInterval(computeDelayAndExpectedCallbackTime, intervalIdentifiersAndResolvers, setTimeoutCallback);
const scheduleTimeout = createScheduleTimeout(computeDelayAndExpectedCallbackTime, timeoutIdentifiersAndResolvers, setTimeoutCallback);

createWorker<IWorkerTimersWorkerCustomDefinition>(self, <TWorkerImplementation<IWorkerTimersWorkerCustomDefinition>>{
    clear: ({ timerId, timerType }) => {
        return { result: timerType === 'interval' ? clearInterval(timerId) : clearTimeout(timerId) };
    },
    set: async ({ delay, now, timerId, timerType }) => {
        if (timerType === 'interval') {
            return { result: await scheduleInterval(delay, timerId, timerType, now) };
        }

        return { result: await scheduleTimeout(delay, timerId, timerType, now) };
    }
});
