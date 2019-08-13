import {IDetailsComponentProps} from "./detail";
import {taskDetailActions} from "./detail-actions";
import {Action, Reducer} from "redux";
import {IPayload} from "../../dto/payload";
import {ITask} from "../../dto/task";
import {ITaskSaveResponse} from "../../dto/task-save-response";
import {ITaskDeleteResponse} from "../../dto/task-delete-response";

function taskEqwal(t1: ITask | null, t2: ITask | null): boolean {
    if (t1 && t2) {
        let key: keyof ITask;
        for (key in t1) {
            if (t1[key] !== t2[key]) {
                return false;
            }
        }
    }
    if (!t1) {
        return false;
    }
    return !!t2;

}

const initialState: IDetailsComponentProps = {
    validation: {},
    task: null,
    hasChanges: false,
    deleting: false,
    error: null,
    saving: false,
    taskInitial: null,
    loading: false,
    saveOnce: false,
};

const reducersByAction = {
    [taskDetailActions.TASK_REQUEST]:
        (state: IDetailsComponentProps): IDetailsComponentProps => ({
            ...state,
            loading: true,
            task: null
        }),
    [taskDetailActions.TASK_RESPONSE_SUCCESS]:
        (state: IDetailsComponentProps, action: Action & IPayload<ITask>): IDetailsComponentProps => ({
            ...state,
            loading: false,
            taskInitial: {...action.payload},
            error: null,
            hasChanges: false,
            task: action.payload,
            validation: {},
        }),
    [taskDetailActions.TASK_RESPONSE_ERROR]:
        (state: IDetailsComponentProps, action: Action & IPayload<string>): IDetailsComponentProps => ({
            ...state,
            loading: false,
            error: action.payload,
        }),
    [taskDetailActions.TASK_TITLE_CHANGED]:
        (state: IDetailsComponentProps, action: Action & IPayload<string>): IDetailsComponentProps => {
            const newTask = {
                ...state.task,
                title: action.payload
            };
            return {
                ...state,
                task: newTask,
                hasChanges: !taskEqwal(newTask, state.taskInitial),
                validation: {
                    ...state.validation,
                    title: newTask.title ? null : 'Заголовок не может быть пустым',
                }
            };
        },
    [taskDetailActions.TASK_SAVE_ONCE]:
        (state: IDetailsComponentProps): IDetailsComponentProps => ({
            ...state,
            saveOnce: true,
        }),
    [taskDetailActions.TASK_SAVE_REQUEST]:
        (state: IDetailsComponentProps): IDetailsComponentProps => ({
            ...state,
            saving: true,
        }),
    [taskDetailActions.TASK_SAVE_RESPONSE_SUCCESS]:
        (state: IDetailsComponentProps, action: Action & IPayload<ITaskSaveResponse>): IDetailsComponentProps => ({
            ...state,
            saving: false,
            hasChanges: false,
            taskInitial: {
                title: '',
                ...state.task
            },
            saveOnce: false,
        }),
    [taskDetailActions.TASK_SAVE_RESPONSE_ERROR]:
        (state: IDetailsComponentProps, action: Action & IPayload<string>): IDetailsComponentProps => ({
            ...state,
            saving: false,
            error: action.payload,

        }),
    [taskDetailActions.TASK_DELETE_REQUEST]:
        (state: IDetailsComponentProps): IDetailsComponentProps => ({
            ...state,
            deleting: true,
        }),
    [taskDetailActions.TASK_DELETE_RESPONSE_SUCCESS]:
        (state: IDetailsComponentProps, action: Action & IPayload<ITaskDeleteResponse>): IDetailsComponentProps => ({
            ...state,
            deleting: false,
        }),
    [taskDetailActions.TASK_DELETE_RESPONSE_ERROR]:
        (state: IDetailsComponentProps, action: Action & IPayload<string>) => ({
            ...state,
            deleting: false,
            error: action.payload,
        }),
};

export const taskReduser: Reducer<IDetailsComponentProps, Action & IPayload> = (state = initialState, action) => {
    if (reducersByAction.hasOwnProperty(action.type)) {
        return reducersByAction[action.type](state, action);
    }
    return state;
};
