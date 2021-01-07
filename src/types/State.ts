type Google = {
    connected: boolean;
    gsheet: boolean;
};

export type State = {
    googleState: Google;
    action: 'save' | 'updated';
    row?: number;
    nextInsertionRow?: number;
};
