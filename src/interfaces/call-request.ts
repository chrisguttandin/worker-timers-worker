import { TTimerType } from '../types';

export interface ICallRequest {

    method: 'call';

    params: {

        timerId: number;

        timerType: TTimerType;

    };

}
