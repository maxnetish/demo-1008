import React, {PropsWithChildren, Fragment} from 'react';
import {ITask} from "../../dto/task";
import {ThunkDispatch} from "redux-thunk";
import {IPayload} from "../../dto/payload";
import {Action} from "redux";
import {deleteTask, fetchTask, saveTask, taskTitleChanged} from "./detail-actions";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import {TaskDetailFormComponent} from "../../components/task-detail-form/task-detail-form";
import {Link} from "react-router-dom";
import {History} from "history";

export interface IDetailsComponentProps {
    task: ITask | null;
    loading: boolean;
    deleting: boolean;
    saving: boolean;
    taskInitial: ITask | null;
    hasChanges: boolean;
    error: string | null;
    validation: { [K in keyof ITask]?: string | null },
    saveOnce: boolean,
}

export interface IDetailsComponentEvents {
    requestTask: (id: number) => void;
    titleChanged: (newTitle: string) => void;
    requestDelete: (history: History) => void;
    requestSave: (history: History) => void;
}

interface IDetailRouteParams {
    id: string
}

function mapStateToProps(state: { task: IDetailsComponentProps }): IDetailsComponentProps {
    const {task: taskState} = state;
    return {
        task: taskState.task,
        validation: taskState.validation,
        error: taskState.error,
        deleting: taskState.deleting,
        saving: taskState.saving,
        saveOnce: taskState.saveOnce,
        taskInitial: taskState.taskInitial,
        hasChanges: taskState.hasChanges,
        loading: taskState.loading,
    };
}

function mapDispatchToProps(dispatch: ThunkDispatch<{ task: IDetailsComponentProps }, {}, Action & IPayload>): IDetailsComponentEvents {
    return {
        requestDelete: (history: History) => dispatch(deleteTask(history)),
        requestSave: (history: History) => dispatch(saveTask(history)),
        titleChanged: (val: string) => dispatch(taskTitleChanged(val)),
        requestTask: (id: number) => dispatch(fetchTask(id)),
    };
}

export const DetailComponent = connect(mapStateToProps, mapDispatchToProps)(
    (props: PropsWithChildren<IDetailsComponentProps & IDetailsComponentEvents & RouteComponentProps<IDetailRouteParams>>) => {

        const idFromPath = parseInt(props.match.params.id, 10);
        if (!props.loading && (!props.task || props.task.id !== idFromPath)) {
            props.requestTask(idFromPath);
        }

        return (
            <div>
                {props.task ?
                    (
                        <Fragment>
                            <div className="page-header">
                                <h1 className="page-header-detail__text">Задача №{props.task.id}</h1>
                                <div>
                                    <button type="button" className="app-button green"
                                            onClick={() => props.requestDelete(props.history)}>Удалить
                                    </button>
                                </div>
                            </div>
                            <TaskDetailFormComponent data={props.task}
                                                     fieldChanged={{title: props.titleChanged}}
                                                     showValidationError={props.saveOnce}
                                                     onFormSubmit={e => {
                                                         props.requestSave(props.history);
                                                         e.preventDefault();
                                                     }}
                                                     validation={props.validation}/>
                            <div className="app-footer-buttons">
                                {props.hasChanges ?
                                    (
                                        <button type="button" className="app-button blue" disabled={props.saving}
                                                onClick={() => props.requestSave(props.history)}>
                                            Сохранить
                                        </button>
                                    ) :
                                    (
                                        <Link className="app-button blue" to="/items">
                                            Вернуться в список
                                        </Link>
                                    )
                                }
                            </div>
                        </Fragment>
                    ) : null
                }
            </div>
        );
    }
);
