import {ITask} from "./task";

export interface ITaskListResponse {
    data: ITask[];
    error: string;
    length: number;
    success: boolean;
}
