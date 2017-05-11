import { TWorkerTimersBrokerMessage } from '../types';

export interface IWorkerTimersBrokerEvent extends Event {

    data: TWorkerTimersBrokerMessage;

}
