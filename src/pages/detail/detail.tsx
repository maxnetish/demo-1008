import React, {PropsWithChildren} from 'react';
import {FunctionComponent} from "react";
import {ITask, ITaskWithValidation} from "../../dto/task";
import {ThunkDispatch} from "redux-thunk";
import {IPayload} from "../../dto/payload";
import {Action} from "redux";
import {deleteTask, fetchTask, saveTask, taskTitleChanged} from "./detail-actions";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";

export interface IDetailsComponentProps {
    task: ITask | null;
    loading: boolean;
    loaded: boolean;
    deleting: boolean;
    saving: boolean;
    taskInitial: ITask | null;
    hasChanges: boolean;
    error: string | null;
    validation: {[K in keyof ITask]?: string | null},
    saveOnce: boolean,
}

export interface IDetailsComponentEvents {
    requestTask: (id: number) => void;
    titleChanged?: (newTitle: string) => void;
    requestDelete?: () => void;
    requestSave?: () => void;
}

function mapStateToProps(state: {task: IDetailsComponentProps}): IDetailsComponentProps {
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
        loaded: taskState.loaded,
        loading: taskState.loading,
    };
}

function mapDispatchToProps(dispatch: ThunkDispatch<{task: IDetailsComponentProps}, {}, Action & IPayload>): IDetailsComponentEvents {
    return {
        requestDelete: () => dispatch(deleteTask()),
        requestSave: () => dispatch(saveTask()),
        titleChanged: (val: string) => dispatch(taskTitleChanged(val)),
        requestTask: (id: number) => dispatch(fetchTask(id)),
    };
}

export const DetailComponent = connect(mapStateToProps, mapDispatchToProps)(
    (props: PropsWithChildren<IDetailsComponentProps & IDetailsComponentEvents & RouteComponentProps>) => {
        return (
            <div>
                Details
            </div>
        );
    }
);
