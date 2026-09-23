import { IWorkerDefinition } from 'worker-factory';
import { TTimerType } from '../types';

export interface IWorkerTimersWorkerCustomDefinition extends IWorkerDefinition {
    clear: {
        params: {
            timerId: number;

            timerType: TTimerType;
        };

        response: {
            result: boolean;
        };
    };

    set: {
        params: {
            delay: number;

            /*
             * @deprecated The worker schedules timers on its own clock since the sums of performance.timeOrigin and
             * performance.now() of two contexts drift apart during system sleep. The value is accepted but ignored.
             */
            now: number;

            timerId: number;

            timerType: TTimerType;
        };

        response: {
            result: boolean;
        };
    };
}
