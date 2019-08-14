import {IPayload} from "../../dto/payload";
import {Action} from "redux";
import {ITask} from "../../dto/task";
import {ITaskSaveResponse} from "../../dto/task-save-response";
import {ITaskDeleteResponse} from "../../dto/task-delete-response";
import {ThunkAction} from "redux-thunk";
import {IDetailsComponentProps} from "./detail";
import {ITaskListResponse} from "../../dto/task-list-response";
import {History} from "history";
import {taskListNeedReload} from "../list/list-actions";

export const taskDetailActions = {
    TASK_REQUEST: Symbol(),
    TASK_RESPONSE_SUCCESS: Symbol(),
    TASK_RESPONSE_ERROR: Symbol(),
    TASK_TITLE_CHANGED: Symbol(),
    TASK_SAVE_ONCE: Symbol(),
    TASK_SAVE_REQUEST: Symbol(),
    TASK_SAVE_RESPONSE_SUCCESS: Symbol(),
    TASK_SAVE_RESPONSE_ERROR: Symbol(),
    TASK_DELETE_REQUEST: Symbol(),
    TASK_DELETE_RESPONSE_SUCCESS: Symbol(),
    TASK_DELETE_RESPONSE_ERROR: Symbol(),
};

function taskRequest(): Action {
    return {
        type: taskDetailActions.TASK_REQUEST,
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

export function taskTitleChanged(val: string): Action & IPayload<string> {
    return {
        type: taskDetailActions.TASK_TITLE_CHANGED,
        payload: val,
    };
}

function taskSaveOnce(): Action {
    return {
        type: taskDetailActions.TASK_SAVE_ONCE,
    };
}

function taskSaveRequest(): Action {
    return {
        type: taskDetailActions.TASK_SAVE_REQUEST,
    };
}

function taskSaveResponseSuccess(response: ITaskSaveResponse): Action & IPayload<ITaskSaveResponse> {
    return {
        type: taskDetailActions.TASK_SAVE_RESPONSE_SUCCESS,
        payload: response,
    };
}

function taskSaveResponseError(error: string): Action & IPayload<string> {
    return {
        type: taskDetailActions.TASK_SAVE_RESPONSE_ERROR,
        payload: error,
    };
}

function taskDeleteRequest(): Action {
    return {
        type: taskDetailActions.TASK_DELETE_REQUEST,
    };
}

function taskDeleteResponseSuccess(response: ITaskDeleteResponse): Action & IPayload<ITaskDeleteResponse> {
    return {
        type: taskDetailActions.TASK_DELETE_RESPONSE_SUCCESS,
        payload: response
    };
}

function taskDeleteResponseError(error: string): Action & IPayload<string> {
    return {
        type: taskDetailActions.TASK_DELETE_RESPONSE_ERROR,
        payload: error
    };
}

export function fetchTask(id: number): ThunkAction<Promise<void>, { task: IDetailsComponentProps }, {}, Action | Action & IPayload> {
    return async dispatch => {
        try {
            dispatch(taskRequest());
            const fetchResult = await fetch('https://test.megapolis-it.ru/api/list', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                }
            });
            const body: ITaskListResponse = await fetchResult.json();
            if (!body.success) {
                dispatch(taskResponseError(body.error));
                return;
            }
            const task = body.data.find(t => t.id === id);
            if (!task) {
                dispatch(taskResponseError('Task not found'));
                return;
            }
            dispatch(taskResponseSuccess(task));
        } catch (e) {
            dispatch(taskResponseError(e.toString()));
        }
    }
}

export function deleteTask(history: History): ThunkAction<Promise<void>, { task: IDetailsComponentProps }, {}, Action | Action & IPayload> {
    return async (dispatch, getState) => {
        const {task} = getState().task;
        if (!task) {
            return;
        }
        try {
            dispatch(taskDeleteRequest());
            const fetchResponse = await fetch(` https://test.megapolis-it.ru/api/list/${task.id}`, {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                }
            });
            const responseBody: ITaskDeleteResponse = await fetchResponse.json();
            if (!responseBody.success) {
                dispatch(taskDeleteResponseError(responseBody.error));
            } else {
                dispatch(taskDeleteResponseSuccess(responseBody));
                // mark that we should update task list
                dispatch(taskListNeedReload());
                // Goto list
                history.push('/items');
            }
        } catch (e) {
            dispatch(taskDeleteResponseError(e.toString()));
        }
    };
}

export function saveTask(history: History): ThunkAction<Promise<void>, { task: IDetailsComponentProps }, {}, Action | Action & IPayload> {
    return async (dispatch, getState) => {
        const {task, validation} = getState().task;
        if (!task) {
            return;
        }
        dispatch(taskSaveOnce());
        if (Object.entries(validation).some(keyVal => keyVal[1])) {
            return;
        }
        try {
            dispatch(taskSaveRequest());
            const fetchResponse = await fetch(` https://test.megapolis-it.ru/api/list/${task.id}`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: task.title
                })
            });
            const responseBody: ITaskSaveResponse = await fetchResponse.json();
            if (!responseBody.success) {
                dispatch(taskSaveResponseError(responseBody.error));
            } else {
                dispatch(taskSaveResponseSuccess(responseBody));
                // mark that we should update task list
                dispatch(taskListNeedReload());
                // Goto list
                history.push('/items');
            }
        } catch (e) {
            dispatch(taskSaveResponseError(e.toString()));
        }
    };
}

