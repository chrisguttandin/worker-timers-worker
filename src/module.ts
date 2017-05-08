import { clearScheduledInterval, clearScheduledTimeout, scheduleInterval, scheduleTimeout } from './helpers/timer';
import { IWorkerTimersEvent } from './interfaces/worker-timers-event';

export { IWorkerTimersEvent };

addEventListener('message', ({ data: { action, delay, id, now, type } }: IWorkerTimersEvent) => {
    try {
        if (action === 'clear') {
            if (type === 'interval') {
                clearScheduledInterval(id);
            } else if (type === 'timeout') {
                clearScheduledTimeout(id);
            } else {
                throw new Error(`The given type "${ type }" is not supported`);
            }
        } else if (action === 'set') {
            if (type === 'interval') {
                scheduleInterval(delay, id, now);
            } else if (type === 'timeout') {
                scheduleTimeout(delay, id, now);
            } else {
                throw new Error(`The given type "${ type }" is not supported`);
            }
        } else {
            throw new Error(`The given action "${ action }" is not supported`);
        }
    } catch (err) {
        postMessage({
            err: {
                message: err.message
            }
        });
    }
});
