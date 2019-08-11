import {IPayload} from "../../dto/payload";
import {Action} from "redux";
import {ITask} from "../../dto/task";

export const taskDetailActions = {
    TASK_REQUEST: Symbol(),
    TASK_RESPONSE_SUCCESS: Symbol(),
    TASK_RESPONSE_ERROR: Symbol(),
    TASK_TITLE_CHANGED: Symbol(),
    TASK_SAVE_REQUEST: Symbol(),
    TASK_SAVE_RESPONSE_SUCCESS: Symbol(),
    TASK_SAVE_RESPONSE_ERROR: Symbol(),
    TASK_DELETE_REQUEST: Symbol(),
    TASK_DELETE_RESPONSE_SUCCESS: Symbol(),
    TASK_DELETE_RESPONSE_ERROR: Symbol(),
};

function taskRequest(id: number): Action & IPayload<number> {
    return {
        type: taskDetailActions.TASK_REQUEST,
        payload: id,
    };
}

function taskResponseSuccess(task: ITask): Action & IPayload<ITask> {
    return {
        type: taskDetailActions.TASK_RESPONSE_SUCCESS,
        payload: task,
    };
}

function taskResponseError(error: string): Action & IPayload<string> {
    return {
        type: taskDetailActions.TASK_RESPONSE_ERROR,
        payload: error,
    };
}

