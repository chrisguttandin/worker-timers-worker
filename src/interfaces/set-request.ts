import { TTimerType } from '../types';

export interface ISetRequest {

    method: 'set';

    params: {

        delay: number;

        now: number;

        timerId: number;

        timerType: TTimerType;

    };

}
