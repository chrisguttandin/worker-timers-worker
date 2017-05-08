import { clearScheduledInterval, clearScheduledTimeout, scheduleInterval, scheduleTimeout } from './helpers/timer';
import { IWorkerTimersEvent } from './interfaces/worker-timers-event';

export { IWorkerTimersEvent };

addEventListener('message', ({ data: { action, delay, id, now, type } }: IWorkerTimersEvent) => {
    if (action === 'clear') {
        if (type === 'interval') {
            clearScheduledInterval(id);
        } else if (type === 'timeout') {
            clearScheduledTimeout(id);
        }

        // @todo Maybe throw an error.
    } else if (action === 'set') {
        if (type === 'interval') {
            scheduleInterval(delay, id, now);
        } else if (type === 'timeout') {
            scheduleTimeout(delay, id, now);
        }

        // @todo Maybe throw an error.
    }

    // @todo Maybe throw an error.
});
