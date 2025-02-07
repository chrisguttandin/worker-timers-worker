import { createClearScheduledInterval } from './factories/clear-scheduled-interval';
import { createClearScheduledTimeout } from './factories/clear-scheduled-timeout';
import { createScheduleInterval } from './factories/schedule-interval';
import { createScheduleTimeout } from './factories/schedule-timeout';
import { computeDelayAndExpectedCallbackTime } from './functions/compute-delay-and-expected-callback-time';
import { setTimeoutCallback } from './functions/set-timeout-callback';
import { IBrokerEvent, IClearResponse, IErrorNotification, IErrorResponse } from './interfaces';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

const scheduledIntervalIdentifiers: Map<number, [number, number]> = new Map();
const scheduledTimeoutIdentifiers: Map<number, [number, number]> = new Map();
const clearScheduledInterval = createClearScheduledInterval(scheduledIntervalIdentifiers);
const clearScheduledTimeout = createClearScheduledTimeout(scheduledTimeoutIdentifiers);
const scheduleInterval = createScheduleInterval(computeDelayAndExpectedCallbackTime, scheduledIntervalIdentifiers, setTimeoutCallback);
const scheduleTimeout = createScheduleTimeout(computeDelayAndExpectedCallbackTime, scheduledTimeoutIdentifiers, setTimeoutCallback);

addEventListener('message', ({ data }: IBrokerEvent) => {
    try {
        if (data.method === 'clear') {
            const {
                id,
                params: { timerId, timerType }
            } = data;

            if (timerType === 'interval') {
                postMessage(<IClearResponse>{ id, result: clearScheduledInterval(timerId) });
            } else if (timerType === 'timeout') {
                postMessage(<IClearResponse>{ id, result: clearScheduledTimeout(timerId) });
            } else {
                throw new Error(`The given type "${timerType}" is not supported`);
            }
        } else if (data.method === 'set') {
            const {
                id,
                params: { delay, now, timerId, timerType }
            } = data;

            if (timerType === 'interval') {
                scheduleInterval(delay, id, timerId, now);
            } else if (timerType === 'timeout') {
                scheduleTimeout(delay, id, timerId, now);
            } else {
                throw new Error(`The given type "${timerType}" is not supported`);
            }
        } else {
            throw new Error(`The given method "${(<any>data).method}" is not supported`);
        }
    } catch (err) {
        postMessage(<IErrorNotification | IErrorResponse>{
            error: {
                message: err.message
            },
            id: data.id,
            result: null
        });
    }
});
