import { TTimerType } from '../types';

export interface ISetRequest {
    id: number;

    method: 'set';

    params: {
        delay: number;

        now: number;

        timerId: number;

        timerType: TTimerType;
    };
}
