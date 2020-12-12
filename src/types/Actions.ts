import { Dates } from './Dates';
import { Info } from './Info';
import { Options } from './Options';
import { Prices } from './Prices';

export type Action =
    | { type: 'setConnected'; value: boolean }
    | { type: 'setInfo'; value: Info }
    | { type: 'setDates'; value: Dates }
    | { type: 'setPrices'; value: Prices }
    | { type: 'setOptions'; value: Options }
    | { type: 'setDocument'; value: Document }
    | { type: 'loadDataToState'; value: Array<string> };
