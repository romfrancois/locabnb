export type State = {
    connected: boolean;
    action: 'save' | 'update' | 'updated';
    row?: number;
    nextInsertionRow?: number;
};
