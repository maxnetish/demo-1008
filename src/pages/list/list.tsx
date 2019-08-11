import * as React from "react";
import {createRef, FormEvent, FunctionComponent} from "react";
import {ITask, ITaskWithDelete, ITaskWithValidation} from "../../dto/task";
import {RouteComponentProps, withRouter} from "react-router";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {
    deleteTask,
    fetchTaskList,
    newTaskDismissDialog,
    newTaskTitleChange,
    requestNewTask,
    saveNewTask
} from "./list-actions";
import {connect} from "react-redux";
import {ModalDialogComponent} from "../../modal/modal";

export interface IListComponentProps {
    taskList: ITaskWithDelete[];
    listError?: string | null;
    listLoading: boolean;
    listLoaded: boolean;
    newTask: ITaskWithValidation | null;
    newTaskError?: string | null;
    newTaskSaving: boolean;
    newTaskDialogOpen: boolean;
    newTaskValidation: { [K in keyof ITask]?: string | null },
    newTaskSubmitOnce: boolean,
    taskDeleting: boolean;
}

export interface IListComponentEvents {
    requestList: () => void;
    requestForNewTask: () => void;
    requestDeleteTask: (taskToDelete: ITask) => void;
    requestSaveNewTask: () => void;
    dismissNewTaskDialog: () => void;
    newTaskTitleChanged: (title: string) => void;
}

function mapStateToProps(state: { taskList: IListComponentProps }): IListComponentProps {
    const {taskList} = state;
    return {
        newTaskValidation: taskList.newTaskValidation,
        newTask: taskList.newTask,
        taskList: taskList.taskList,
        newTaskDialogOpen: taskList.newTaskDialogOpen,
        taskDeleting: taskList.taskDeleting,
        newTaskSaving: taskList.newTaskSaving,
        newTaskError: taskList.newTaskError,
        listLoading: taskList.listLoading,
        listLoaded: taskList.listLoaded,
        listError: taskList.listError,
        newTaskSubmitOnce: taskList.newTaskSubmitOnce,
    };
}

function mapDispatchToProps(dispatch: ThunkDispatch<{ taskList: IListComponentProps }, {}, AnyAction>): IListComponentEvents {
    return {
        dismissNewTaskDialog: () => dispatch(newTaskDismissDialog()),
        requestDeleteTask: (task: ITask) => dispatch(deleteTask(task)),
        requestForNewTask: () => dispatch(requestNewTask()),
        requestList: () => dispatch(fetchTaskList()),
        requestSaveNewTask: () => dispatch(saveNewTask()),
        newTaskTitleChanged: (title: string) => dispatch(newTaskTitleChange(title)),
    };
}

export const ListComponent = connect(mapStateToProps, mapDispatchToProps)((props: IListComponentProps & IListComponentEvents & RouteComponentProps) => {
    console.log(props);
    if (!props.listLoaded) {
        props.requestList();
    }

    function onNewTaskTitleChanged(e: FormEvent<HTMLInputElement>) {
        props.newTaskTitleChanged(e.currentTarget.value);
    }

    return (
        <div>
            <ModalDialogComponent className="app-modal" openModal={props.newTaskDialogOpen}>
                <div className="dialog-new-task-ct">
                    <button type="button" className="app-button cross-close-dialog red"
                            onClick={props.dismissNewTaskDialog}>
                        <i className="fas fa-times"/>
                    </button>
                    <form className="pure-form pure-form-stacked">
                        <label htmlFor="new_task_title">Краткое описание</label>
                        <input id="new_task_title" type="text" value={(props.newTask && props.newTask.title) || ''}
                               onChange={onNewTaskTitleChanged}/>
                        {(props.newTaskValidation.title && props.newTaskSubmitOnce) ?
                            <span className="pure-form-message">{props.newTaskValidation.title}</span> : null}
                    </form>
                    <div>
                        <button type="button" className="app-button green" disabled={props.newTaskSaving}
                                onClick={props.requestSaveNewTask}>Создать
                        </button>
                    </div>
                </div>
            </ModalDialogComponent>
            <div className="page-header">
                <h1 className="page-header__text">Список задач</h1>
                <div>
                    <button type="button" className="app-button green" onClick={props.requestForNewTask}>Добавить
                    </button>
                </div>
            </div>
            <table>
                <tbody>
                {props.taskList.map(task => (
                    <tr key={task.id}>
                        <td>Задача №{task.id}</td>
                        <td>{task.title}</td>
                        <td>
                            <button type="button" className="app-button icon grey">Ред</button>
                            <button type="button" className="app-button icon red"
                                    onClick={props.requestDeleteTask.bind(null, task)}>Уд
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
});
