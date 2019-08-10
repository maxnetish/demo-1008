import * as React from "react";
import {FunctionComponent} from "react";
import {ITask, ITaskWithDelete, ITaskWithValidation} from "../../dto/task";

export interface IListComponentProps {
    taskList: ITaskWithDelete[];
    listError?: string | null;
    listLoading: boolean;
    newTask: ITaskWithValidation | null;
    newTaskError?: string | null;
    newTaskSaving: boolean;
    newTaskDialogOpen: boolean;
    newTaskValidation: {[K in keyof ITask]?: string | null},
    newTaskSubmitOnce: boolean,
    taskDeleting: boolean;
}

export interface IListComponentEvents {
    requestList?: () => void;
    requestForNewTask?: () => void;
    requestDeleteTask?: (taskToDelete: ITask) => void;
    requestSaveNewTask?: () => void;
    dismissNewTaskDialog?: () => void;
}

export const ListComponent: FunctionComponent<IListComponentProps & IListComponentEvents> = (props: IListComponentProps & IListComponentEvents) => {
    return (
        <div>List</div>
    );
}
