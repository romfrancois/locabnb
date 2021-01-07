export enum Languages {
    FR = 'FR',
    EN = 'EN',
}

export enum Locations {
    BELLEGARDE = 'BELLEGARDE',
    SALOU = 'SALOU',
}

export enum Origins {
    HOMEAWAY = 'HOMEAWAY',
    AIRBNB = 'AIRBNB',
    NOUS = 'NOUS',
}

export type Document = {
    language: Languages;
    location: Locations;
    origin: Origins;
};
