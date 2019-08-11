import * as React from 'react';
import {ITask} from "../../dto/task";
import {FunctionComponent, Fragment} from "react";

interface ITaskDetailFormProps {
    data: ITask | null,
    validation: { [K in keyof ITask]?: string | null},
    showValidationError: boolean,
    className?: string,
}

interface ITaskDetailFormEvents {
    fieldChanged: {
        [K in keyof ITask]?: (val: ITask[K]) => void
    }
}

export const TaskDetailFormComponent: FunctionComponent<ITaskDetailFormProps & ITaskDetailFormEvents> = props => {
    return (
        <Fragment>
            {props.data ? <form className={`pure-form pure-form-stacked ${props.className}`}>
                <label htmlFor="new_task_title">Краткое описание</label>
                <input id="new_task_title" type="text" value={props.data.title}
                       onChange={e => props.fieldChanged.title ? props.fieldChanged.title(e.currentTarget.value) : null}/>
                {(props.validation.title && props.showValidationError) ?
                    <span className="pure-form-message">{props.validation.title}</span> : null}
            </form> : null}
        </Fragment>
    );
};
