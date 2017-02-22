export interface IWorkerTimersEvent extends Event {

    data: {

        action: string;

        delay: number;

        id: number;

        now: number;

        type: string;

    };

}
