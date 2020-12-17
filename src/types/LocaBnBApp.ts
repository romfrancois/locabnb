import { Dates } from './Dates';
import { Document } from './Document';
import { Info } from './Info';
import { Options } from './Options';
import { Prices } from './Prices';
import { State } from './State';

export type LocaBnBApp = {
    info: Info;
    dates: Dates;
    prices: Prices;
    options: Options;
    document: Document;
    loadDataToState: Array<string>;
    status: State;
    menuSelected: 'form' | 'table';
};
