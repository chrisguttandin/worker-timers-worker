import { clearScheduledInterval, clearScheduledTimeout, scheduleInterval, scheduleTimeout } from './helpers/timer';
import { IClearResponse, IWorkerTimersBrokerEvent } from './interfaces';

export * from './interfaces';
export * from './types';

addEventListener('message', ({ data }: IWorkerTimersBrokerEvent) => {
    try {
        if (data.method === 'clear') {
            const { id, params: { timerId, timerType } } = data;

            if (timerType === 'interval') {
                clearScheduledInterval(timerId);

                postMessage(<IClearResponse> { error: null, id });
            } else if (timerType === 'timeout') {
                clearScheduledTimeout(timerId);

                postMessage(<IClearResponse> { error: null, id });
            } else {
                throw new Error(`The given type "${ timerType }" is not supported`);
            }
        } else if (data.method === 'set') {
            const { params: { delay, now, timerId, timerType } } = data;

            if (timerType === 'interval') {
                scheduleInterval(delay, timerId, now);
            } else if (timerType === 'timeout') {
                scheduleTimeout(delay, timerId, now);
            } else {
                throw new Error(`The given type "${ timerType }" is not supported`);
            }
        } else {
            throw new Error(`The given method "${ (<any> data).method }" is not supported`);
        }
    } catch (err) {
        postMessage({
            err: {
                message: err.message
            }
        });
    }
});
