export interface ITask {
    id?: number;
    title: string;
}

export interface ITaskWithValidation extends ITask {
    titleValidationError: string;
}

export interface ITaskWithDelete extends ITask {
    deleteError?: string | null;
    deleting?: boolean;
}
