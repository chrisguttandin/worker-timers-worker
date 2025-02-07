import { IClearResponse, IErrorNotification, IErrorResponse, ISetResponse } from '../interfaces';

export type TWorkerMessage = ISetResponse | IClearResponse | IErrorNotification | IErrorResponse;
