type Google = {
    connected: boolean;
    gsheet: boolean;
};

export type State = {
    googleState: Google;
    action: 'loadData' | 'save' | 'updated';
    row?: number;
    nextInsertionRow?: number;
};
