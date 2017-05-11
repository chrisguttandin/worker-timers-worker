import { TWorkerTimersWorkerMessage } from '../types';

export interface IWorkerTimersWorkerEvent extends Event {

    data: TWorkerTimersWorkerMessage;

}
