import {IListComponentProps} from "./list";
import {Reducer} from "redux";
import {listActions} from "./list-actions";
import {ITask} from "../../dto/task";

const initialState: IListComponentProps = {
    listError: null,
    listLoading: false,
    newTaskDialogOpen: false,
    newTaskError: null,
    newTaskSaving: false,
    taskDeleting: false,
    taskList: [],
    newTask: null,
    newTaskValidation: {},
    newTaskSubmitOnce: false,
};

export const listRedusers: Reducer<IListComponentProps> = (state = initialState, action) => {
    switch (action.type) {
        case listActions.NEW_TASK_DISMISS_DIALOG:
            if(!state.newTaskDialogOpen) {
                return state;
            }
            return Object.assign({}, state, {
                newTask: null,
                newTaskDialogOpen: false,
                newTaskValidation: {},
                newTaskSubmitOnce: false,
            });
        case listActions.NEW_TASK_RESPONSE_SAVE_ERROR:
            return Object.assign({}, state, {
                newTaskError: action.payload,
                newTaskSaving: false,
            });
        case listActions.NEW_TASK_RESPONSE_SAVE_SUCCESS:
            if(action.payload.id) {
                return Object.assign({}, state, {
                    taskList: state.taskList.concat({
                        id: action.payload.id,
                        title: state.newTask ? state.newTask.title : '',
                    }),
                    newTaskSaving: false,
                });
            }
            return state;
        case listActions.NEW_TASK_REQUEST_SAVE:
            return Object.assign({}, state, {
                newTaskSaving: true,
            });
        case listActions.NEW_TASK_TITLE_CHANGED:
            return Object.assign({}, state, {
                newTask: {
                    id: state.newTask && state.newTask.id,
                    title: action.payload,
                },
                newTaskValidation: {
                    title: action.payload? null : 'Заголовок не может быть пустым'
                }
            });
        case listActions.LIST_RESPONSE_DELETE_ERROR: {
            const indexOfErrorTask = state.taskList.findIndex(t => t.id === action.payload.id);
            const newTaskList = state.taskList.slice();
            newTaskList.splice(indexOfErrorTask, 1, Object.assign({}, newTaskList[indexOfErrorTask], {
                deleteError: action.payload.error,
                deleting: false,
            }));
            return Object.assign({}, state, {
                taskList: newTaskList
            });
        }
        case listActions.LIST_RESPONSE_DELETE_SUCCESS: {
            const newTaskList = state.taskList.slice();
            const indexOfDeletedTask = newTaskList.findIndex(t => t.id === action.payload);
            newTaskList.splice(indexOfDeletedTask, 1);
            return Object.assign({}, state, {
                taskList: newTaskList
            });
        }
        case listActions.LIST_REQUEST_DELETE: {
            const indexOfDeletedTask = state.taskList.findIndex(t => t.id === action.payload.id);
            const newTaskList = state.taskList.slice();
            newTaskList.splice(indexOfDeletedTask, 1, Object.assign({}, newTaskList[indexOfDeletedTask], {
                deleting: true,
            }));
            return Object.assign({}, state, {
                taskList: newTaskList
            });
        }
        case listActions.LIST_REQUEST_NEW: {
            return Object.assign({}, state, {
                newTask: {
                    title: ''
                },
                newTaskError: null,
                newTaskDialogOpen: true,
                newTaskValidation: {
                    title: 'Заголовок не может быть пустым'
                },
                newTaskSubmitOnce: false,
            });
        }
        case listActions.LIST_RESPONSE_ERROR: {
            return Object.assign({}, state, {
                listError: action.payload,
                listLoading: false,
            });
        }
        case listActions.LIST_RESPONSE_SUCCESS: {
            return Object.assign({}, state, {
                taskList: action.payload.data.map((t: ITask) => Object.assign(t, {
                    deleteError: null,
                    deleting: false,
                })),
                listError: null,
                listLoading: false,
            });
        }
        case listActions.LIST_REQUEST: {
            return Object.assign({}, state, {
                listLoading: true,
            });
        }
        case listActions.NEW_TASK_VALIDATION_CHANGE: {
            return Object.assign({}, state, {
                newTaskValidation: action.payload
            });
        }
        case listActions.NEW_TASK_SUBMIT_ONCE: {
            return Object.assign({}, state, {
                newTaskSubmitOnce: action.payload
            });
        }
        default:
            return state;
    }
};
