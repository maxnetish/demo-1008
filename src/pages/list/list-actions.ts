import {Action, AnyAction} from "redux";
import {IPayload} from "../../dto/payload";
import {ITaskListResponse} from "../../dto/task-list-response";
import {ITask} from "../../dto/task";
import {ITaskDeleteResponse} from "../../dto/task-delete-response";
import {ITaskCreateResponse} from "../../dto/task-create-response";
import {ThunkAction} from "redux-thunk";
import {IListComponentProps} from "./list";

export const listActions = {
    LIST_REQUEST: Symbol(),
    LIST_RESPONSE_SUCCESS: Symbol(),
    LIST_RESPONSE_ERROR: Symbol(),
    LIST_REQUEST_NEW: Symbol(),
    LIST_REQUEST_DELETE: Symbol(),
    LIST_RESPONSE_DELETE_SUCCESS: Symbol(),
    LIST_RESPONSE_DELETE_ERROR: Symbol(),
    NEW_TASK_TITLE_CHANGED: Symbol(),
    NEW_TASK_DISMISS_DIALOG: Symbol(),
    NEW_TASK_REQUEST_SAVE: Symbol(),
    NEW_TASK_RESPONSE_SAVE_SUCCESS: Symbol(),
    NEW_TASK_RESPONSE_SAVE_ERROR: Symbol(),
    NEW_TASK_VALIDATION_CHANGE: Symbol(),
    NEW_TASK_SUBMIT_ONCE: Symbol()
};

function requestList(): Action {
    return {
        type: listActions.LIST_REQUEST
    };
}

function responseListSuccess(taskListResponse: ITaskListResponse): Action & IPayload<ITaskListResponse> {
    return {
        type: listActions.LIST_RESPONSE_SUCCESS,
        payload: taskListResponse,
    };
}

function responseListError(err: string): Action & IPayload<string> {
    return {
        type: listActions.LIST_RESPONSE_ERROR,
        payload: err,
    };
}

export function requestNewTask(): Action {
    return {
        type: listActions.LIST_REQUEST_NEW,
    };
}

function requestDelete(taskToDelete: ITask): Action & IPayload<ITask> {
    return {
        type: listActions.LIST_REQUEST_DELETE,
        payload: taskToDelete,
    };
}

function responseListDeleteSuccess(taskId: number): Action & IPayload<number> {
    return {
        type: listActions.LIST_RESPONSE_DELETE_SUCCESS,
        payload: taskId,
    };
}

function responseListDeleteError(payload: { error: string, taskId: number }): Action & IPayload<{ error: string, taskId: number }> {
    return {
        type: listActions.LIST_RESPONSE_DELETE_ERROR,
        payload,
    };
}

export function newTaskTitleChange(newTitle: string): Action & IPayload<string> {
    return {
        type: listActions.NEW_TASK_TITLE_CHANGED,
        payload: newTitle,
    };
}

function newTaskSubmitOnce(): Action {
    return {
        type: listActions.NEW_TASK_SUBMIT_ONCE,
    };
}

function newTaskSaveRequest(): Action {
    return {
        type: listActions.NEW_TASK_REQUEST_SAVE,
    };
}

function newTaskSaveResponseSuccess(taskCreateResponse: ITaskCreateResponse): Action & IPayload<ITaskCreateResponse> {
    return {
        type: listActions.NEW_TASK_RESPONSE_SAVE_SUCCESS,
        payload: taskCreateResponse,
    };
}

function newTaskSaveResponseError(error: string): Action & IPayload<string> {
    return {
        type: listActions.NEW_TASK_RESPONSE_SAVE_ERROR,
        payload: error,
    };
}

export function newTaskDismissDialog(): Action {
    return {
        type: listActions.NEW_TASK_DISMISS_DIALOG,
    };
}

function newTaskValidationChange(validationState: { [K in keyof ITask]?: string | null }): Action & IPayload<{ [K in keyof ITask]?: string | null }> {
    return {
        type: listActions.NEW_TASK_VALIDATION_CHANGE,
        payload: validationState,
    }
}

export function fetchTaskList(): ThunkAction<Promise<void>, {taskList: IListComponentProps}, {}, AnyAction> {
    return async dispatch => {
        dispatch(requestList());
        try {
            const fetchResult = await fetch('https://test.megapolis-it.ru/api/list', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                }
            });
            const responseBody: ITaskListResponse = await fetchResult.json();
            if (responseBody.error) {
                dispatch(responseListError(responseBody.error));
            } else {
                dispatch(responseListSuccess(responseBody));
            }
        } catch (e) {
            dispatch(responseListError(e.toString()));
        }
    };
}

export function deleteTask(task: ITask): ThunkAction<Promise<void>, {taskList: IListComponentProps}, {}, AnyAction> {
    return async dispatch => {
        if (!task.id) {
            return;
        }
        dispatch(requestDelete(task));
        try {
            const fetchResult = await fetch(`https://test.megapolis-it.ru/api/list/${task.id}`, {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                }
            });
            const responseBody: ITaskDeleteResponse = await fetchResult.json();
            if (responseBody.error) {
                dispatch(responseListDeleteError({error: responseBody.error, taskId: task.id}));
            } else {
                dispatch(responseListDeleteSuccess(task.id));
            }
        } catch (e) {
            dispatch(responseListDeleteError(e.toString()));
        }
    };
}

export function saveNewTask(): ThunkAction<Promise<void>, {taskList: IListComponentProps}, {}, AnyAction> {
    return async (dispatch, getState) => {
        const {newTask, newTaskValidation} = getState().taskList;
        if (!newTask) {
            return;
        }
        dispatch(newTaskSubmitOnce())
        if (Object.entries(newTaskValidation).some(keyVal => keyVal[1])) {
            return;
        }
        try {
            dispatch(newTaskSaveRequest());
            const fetchResponse = await fetch(`https://test.megapolis-it.ru/api/list`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: newTask.title
                })
            });
            const responseBody: ITaskCreateResponse = await fetchResponse.json();
            if (responseBody.error) {
                dispatch(newTaskSaveResponseError(responseBody.error));
            } else {
                dispatch(newTaskSaveResponseSuccess(responseBody));
            }
        } catch (e) {
            dispatch(newTaskSaveResponseError(e.toString()));
        }
    };
}






