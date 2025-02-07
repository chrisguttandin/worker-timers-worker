import { TTimerType } from '../types';

export interface ISetResponse {
    id: number;

    result: null | {
        timerId: number;

        timerType: TTimerType;
    };
}
