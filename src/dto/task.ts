export interface ITask {
    id?: number;
    title: string;
}

export interface ITaskWithDelete extends ITask {
    deleteError?: string | null;
    deleting?: boolean;
}
