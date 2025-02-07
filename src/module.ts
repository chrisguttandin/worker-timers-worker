import { TWorkerImplementation, createWorker } from 'worker-factory';
import { createClearScheduledInterval } from './factories/clear-scheduled-interval';
import { createClearScheduledTimeout } from './factories/clear-scheduled-timeout';
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

const scheduledIntervalIdentifiers: Map<number, [number, TResolveSetResponseResultPromise]> = new Map();
const scheduledTimeoutIdentifiers: Map<number, [number, TResolveSetResponseResultPromise]> = new Map();
const clearScheduledInterval = createClearScheduledInterval(scheduledIntervalIdentifiers);
const clearScheduledTimeout = createClearScheduledTimeout(scheduledTimeoutIdentifiers);
const scheduleInterval = createScheduleInterval(computeDelayAndExpectedCallbackTime, scheduledIntervalIdentifiers, setTimeoutCallback);
const scheduleTimeout = createScheduleTimeout(computeDelayAndExpectedCallbackTime, scheduledTimeoutIdentifiers, setTimeoutCallback);

createWorker<IWorkerTimersWorkerCustomDefinition>(self, <TWorkerImplementation<IWorkerTimersWorkerCustomDefinition>>{
    clear: ({ timerId, timerType }) => {
        if (timerType === 'interval') {
            return { result: clearScheduledInterval(timerId) };
        }

        return { result: clearScheduledTimeout(timerId) };
    },
    set: async ({ delay, now, timerId, timerType }) => {
        if (timerType === 'interval') {
            return { result: await scheduleInterval(delay, timerId, timerType, now) };
        }

        return { result: await scheduleTimeout(delay, timerId, timerType, now) };
    }
});
