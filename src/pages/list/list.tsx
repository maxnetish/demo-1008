import * as React from "react";
import {FormEvent} from "react";
import {ITask, ITaskWithDelete, ITaskWithValidation} from "../../dto/task";
import {RouteComponentProps} from "react-router";
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
import {ModalDialogComponent} from "../../components/modal/modal";
import {TaskDetailFormComponent} from "../../components/task-detail-form/task-detail-form";
import {Link} from "react-router-dom";

export interface IListComponentProps {
    taskList: ITaskWithDelete[];
    listError?: string | null;
    listLoading: boolean;
    listLoaded: boolean;
    newTask: ITask | null;
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
    if (!props.listLoaded && !props.listLoading) {
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
                    <TaskDetailFormComponent data={props.newTask} validation={props.newTaskValidation}
                                             showValidationError={props.newTaskSubmitOnce}
                                             fieldChanged={{title: props.newTaskTitleChanged}}/>
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
                            <Link className="app-button icon grey" to={`/items/${task.id}`}>Ред</Link>
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
