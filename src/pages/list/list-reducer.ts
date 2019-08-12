import {IListComponentProps} from "./list";
import {Action, AnyAction, Reducer} from "redux";
import {listActions} from "./list-actions";
import {ITask} from "../../dto/task";
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
    [listActions.LIST_REQUEST]: (state: IListComponentProps) => Object.assign({}, state, {
        listLoading: true,
    }),
    [listActions.LIST_REQUEST_DELETE]: (state: IListComponentProps, action: Action & IPayload<ITask>) => {
        const indexOfDeletedTask = state.taskList.findIndex(t => t.id === action.payload.id);
        const newTaskList = state.taskList.slice();
        newTaskList.splice(indexOfDeletedTask, 1, Object.assign({}, newTaskList[indexOfDeletedTask], {
            deleting: true,
        }));
        return Object.assign({}, state, {
            taskList: newTaskList
        });
    },
    [listActions.LIST_REQUEST_NEW]: (state: IListComponentProps) => Object.assign({}, state, {
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
    [listActions.LIST_RESPONSE_DELETE_ERROR]: (state: IListComponentProps, action: Action & IPayload<{ error: string, taskId: number }>) => {
        const indexOfErrorTask = state.taskList.findIndex(t => t.id === action.payload.taskId);
        const newTaskList = state.taskList.slice();
        newTaskList.splice(indexOfErrorTask, 1, Object.assign({}, newTaskList[indexOfErrorTask], {
            deleteError: action.payload.error,
            deleting: false,
        }));
        return Object.assign({}, state, {
            taskList: newTaskList
        });
    },
    [listActions.LIST_RESPONSE_DELETE_SUCCESS]: (state: IListComponentProps, action: Action & IPayload<number>) => {
        const newTaskList = state.taskList.slice();
        const indexOfDeletedTask = newTaskList.findIndex(t => t.id === action.payload);
        newTaskList.splice(indexOfDeletedTask, 1);
        return Object.assign({}, state, {
            taskList: newTaskList
        });
    },
    [listActions.LIST_RESPONSE_ERROR]: (state: IListComponentProps, action: Action & IPayload<string>) => Object.assign({}, state, {
        listError: action.payload,
        listLoading: false,
        listLoaded: true,
    }),
    [listActions.LIST_RESPONSE_SUCCESS]: (state: IListComponentProps, action: Action & IPayload<ITaskListResponse>) => Object.assign({}, state, {
        taskList: action.payload.data.map((t: ITask) => Object.assign(t, {
            deleteError: null,
            deleting: false,
        })),
        listError: null,
        listLoading: false,
        listLoaded: true,
    }),
    [listActions.NEW_TASK_DISMISS_DIALOG]: (state: IListComponentProps) => {
        if (!state.newTaskDialogOpen) {
            return state;
        }
        return Object.assign({}, state, {
            newTask: null,
            newTaskDialogOpen: false,
            newTaskValidation: {},
            newTaskSubmitOnce: false,
        });
    },
    [listActions.NEW_TASK_REQUEST_SAVE]: (state: IListComponentProps) => Object.assign({}, state, {
        newTaskSaving: true,
    }),
    [listActions.NEW_TASK_RESPONSE_SAVE_ERROR]: (state: IListComponentProps, action: Action & IPayload<string>) => Object.assign({}, state, {
        newTaskError: action.payload,
        newTaskSaving: false,
    }),
    [listActions.NEW_TASK_RESPONSE_SAVE_SUCCESS]: (state: IListComponentProps, action: Action & IPayload<ITaskCreateResponse>) => {
        if (action.payload.id) {
            return Object.assign({}, state, {
                taskList: state.taskList.concat({
                    id: action.payload.id,
                    title: state.newTask ? state.newTask.title : '',
                }),
                newTaskSaving: false,
                newTaskDialogOpen: false,
            });
        }
        return state;
    },
    [listActions.NEW_TASK_SUBMIT_ONCE]: (state: IListComponentProps) => Object.assign({}, state, {
        newTaskSubmitOnce: true
    }),
    [listActions.NEW_TASK_TITLE_CHANGED]: (state: IListComponentProps, action: Action & IPayload<string>) => Object.assign({}, state, {
        newTask: {
            id: state.newTask && state.newTask.id,
            title: action.payload,
        },
        newTaskValidation: {
            title: action.payload ? null : 'Заголовок не может быть пустым'
        }
    }),
    [listActions.NEW_TASK_VALIDATION_CHANGE]: (state: IListComponentProps, action: Action & IPayload<string>) => Object.assign({}, state, {
        newTaskValidation: action.payload
    })
};

export const listReduser: Reducer<IListComponentProps, Action & IPayload> = (state = initialState, action) => {
    if (reduceActions.hasOwnProperty(action.type)) {
        return reduceActions[action.type](state, action);
    }
    return state;
};
