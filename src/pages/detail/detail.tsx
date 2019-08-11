import React, {PropsWithChildren} from 'react';
import {FunctionComponent} from "react";
import {ITask, ITaskWithValidation} from "../../dto/task";

export interface IDetailsComponentProps {
    task?: ITask;
    deleting: boolean;
    saving: boolean;
    taskInitial?: ITask;
    changed: boolean;
    error: string;
    validation: {[K in keyof ITask]?: string | null}
}

export interface IDetailsComponentEvents {
    titleChanged?: (newTitle: string) => void;
    requestDelete?: () => void;
    requestSave?: () => void;
}

export const DetailComponent: FunctionComponent<IDetailsComponentProps & IDetailsComponentEvents> = (props: PropsWithChildren<IDetailsComponentProps & IDetailsComponentEvents>) => {
    return (
        <div>
            Details
        </div>
    );
};
