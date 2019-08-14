import {IListComponentProps} from "./list";
import {Action, Reducer} from "redux";
import {listActions} from "./list-actions";
import {ITask, ITaskWithDelete} from "../../dto/task";
import {IPayload} from "../../dto/payload";
import {ITaskListResponse} from "../../dto/task-list-response";
import {ITaskCreateResponse} from "../../dto/task-create-response";

const initialState: IListComponentProps = {
    listError: null,
    listLoading: false,
    listLoaded: false,
    newTaskDialogOpen: false,
    newTaskError: null,
    newTaskSaving: false,
    taskDeleting: false,
    taskList: [],
    newTask: null,
    newTaskValidation: {},
    newTaskSubmitOnce: false,
};

const reduceActions = {
    [listActions.LIST_REQUEST]:
        (state: IListComponentProps): IListComponentProps => ({
            ...state,
            listLoading: true,
        }),
    [listActions.LIST_REQUEST_DELETE]:
        (state: IListComponentProps, action: Action & IPayload<ITask>): IListComponentProps => {
            const indexOfDeletingTask = state.taskList.findIndex(t => t.id === action.payload.id);
            const newTaskList = [...state.taskList];
            newTaskList[indexOfDeletingTask] = {
                ...newTaskList[indexOfDeletingTask],
                deleting: true
            };
            return {
                ...state,
                taskList: newTaskList,
            };
        },
    [listActions.LIST_REQUEST_NEW]:
        (state: IListComponentProps): IListComponentProps => ({
            ...state,
            newTask: {
                title: ''
            },
            newTaskError: null,
            newTaskDialogOpen: true,
            newTaskValidation: {
                title: 'Заголовок не может быть пустым'
            },
            newTaskSubmitOnce: false,
        }),
    [listActions.LIST_RESPONSE_DELETE_ERROR]:
        (state: IListComponentProps, action: Action & IPayload<{ error: string, taskId: number }>): IListComponentProps => {
            const indexOfErrorTask = state.taskList.findIndex(t => t.id === action.payload.taskId);
            const newTaskList = [...state.taskList];
            newTaskList[indexOfErrorTask] = {
                ...newTaskList[indexOfErrorTask],
                deleteError: action.payload.error,
                deleting: false,
            };
            return {
                ...state,
                taskList: newTaskList
            };
        },
    [listActions.LIST_RESPONSE_DELETE_SUCCESS]:
        (state: IListComponentProps, action: Action & IPayload<number>): IListComponentProps => {
            const newTaskList = [...state.taskList];
            const indexOfDeletedTask = newTaskList.findIndex(t => t.id === action.payload);
            newTaskList.splice(indexOfDeletedTask, 1);
            return {
                ...state,
                taskList: newTaskList
            };
        },
    [listActions.LIST_RESPONSE_ERROR]:
        (state: IListComponentProps, action: Action & IPayload<string>): IListComponentProps => ({
            ...state,
            listError: action.payload,
            listLoading: false,
            listLoaded: true,
        }),
    [listActions.LIST_RESPONSE_SUCCESS]:
        (state: IListComponentProps, action: Action & IPayload<ITaskListResponse>): IListComponentProps => ({
            ...state,
            taskList: action.payload.data.map((task: ITask): ITaskWithDelete => ({
                ...task,
                deleteError: null,
                deleting: false
            })),
            listError: null,
            listLoading: false,
            listLoaded: true,
        }),
    [listActions.NEW_TASK_DISMISS_DIALOG]:
        (state: IListComponentProps): IListComponentProps => {
            if (!state.newTaskDialogOpen) {
                return state;
            }
            return {
                ...state,
                newTask: null,
                newTaskDialogOpen: false,
                newTaskValidation: {},
                newTaskSubmitOnce: false,
            };
        },
    [listActions.NEW_TASK_REQUEST_SAVE]:
        (state: IListComponentProps): IListComponentProps => ({
            ...state,
            newTaskSaving: true,
        }),
    [listActions.NEW_TASK_RESPONSE_SAVE_ERROR]:
        (state: IListComponentProps, action: Action & IPayload<string>): IListComponentProps => ({
            ...state,
            newTaskError: action.payload,
            newTaskSaving: false,
        }),
    [listActions.NEW_TASK_RESPONSE_SAVE_SUCCESS]:
        (state: IListComponentProps, action: Action & IPayload<ITaskCreateResponse>): IListComponentProps => {
            if (!action.payload.id) {
                return state;
            }
            return {
                ...state,
                taskList: state.taskList.concat({
                    id: action.payload.id,
                    title: state.newTask ? state.newTask.title : '',
                }),
                newTaskSaving: false,
                newTaskDialogOpen: false,
            };
        },
    [listActions.NEW_TASK_SUBMIT_ONCE]:
        (state: IListComponentProps): IListComponentProps => ({
            ...state,
            newTaskSubmitOnce: true
        }),
    [listActions.NEW_TASK_TITLE_CHANGED]:
        (state: IListComponentProps, action: Action & IPayload<string>): IListComponentProps => ({
            ...state,
            newTask: {
                ...state.newTask,
                title: action.payload,
            },
            newTaskValidation: {
                ...state.newTaskValidation,
                title: action.payload ? null : 'Заголовок не может быть пустым'
            }
        }),
    [listActions.LIST_BECOME_DIRTY]:
        (state: IListComponentProps): IListComponentProps => ({
            ...state,
            listLoaded: false,
            taskList: [],
        }),
};

export const listReduser: Reducer<IListComponentProps, Action & IPayload> = (state = initialState, action) => {
    if (reduceActions.hasOwnProperty(action.type)) {
        return reduceActions[action.type](state, action);
    }
    return state;
};
