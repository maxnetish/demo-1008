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
    return !(t1 || t2);
}

const initialState: IDetailsComponentProps = {
    validation: {},
    task: null,
    hasChanges: false,
    deleting: false,
    error: null,
    saving: false,
    taskInitial: null,
    loaded: false,
    loading: false,
    saveOnce: false,
};

const reducersByAction = {
    [taskDetailActions.TASK_REQUEST]:
        (state: IDetailsComponentProps): IDetailsComponentProps => ({
            ...state,
            loading: true
        }),
    [taskDetailActions.TASK_RESPONSE_SUCCESS]:
        (state: IDetailsComponentProps, action: Action & IPayload<ITask>): IDetailsComponentProps => ({
            ...state,
            loading: false,
            loaded: true,
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
            loaded: true,
            error: action.payload,
        }),
    [taskDetailActions.TASK_TITLE_CHANGED]:
        (state: IDetailsComponentProps, action: Action & IPayload<string>): IDetailsComponentProps => ({
            ...state,
            task: {
                ...state.task,
                title: action.payload
            },
            hasChanges: !taskEqwal(state.task, state.taskInitial),
        }),
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
    [taskDetailActions.TASK_VALIDATE]:
        (state: IDetailsComponentProps): IDetailsComponentProps => ({
            ...state,
            validation: {
                ...state.validation,
                title: (state.task && !state.task.title) ? 'Заголовок не может быть пустым' : null
            }
        })
};

export const taskReduser: Reducer<IDetailsComponentProps, Action & IPayload> = (state = initialState, action) => {
    if (reducersByAction.hasOwnProperty(action.type)) {
        return reducersByAction[action.type](state, action);
    }
    return state;
};
