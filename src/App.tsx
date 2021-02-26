import React, { useReducer } from 'react';

import PricesCard from './components/PricesCard';
import DatesCard from './components/DatesCard';
import InfoCard from './components/InfoCard';
import OptionsCard from './components/OptionsCard';
import DocumentCard from './components/DocumentCard';

import { LocaBnBApp } from './types/LocaBnBApp';
import { Dates } from './types/Dates';
import { Info } from './types/Info';
import { Prices } from './types/Prices';
import { Options } from './types/Options';
import { Document } from './types/Document';
import { State } from './types/State';
import GoogleSheet from './components/google/GoogleSheet';
import MenuComponent from './components/Menu';

import './res/css/index.module.css';

import ActionMenu from './components/ActionMenu';

type Action =
    | { type: 'setGoogleConnected'; value: boolean }
    | { type: 'enableTableMenu'; value: boolean }
    | {
          type: 'action';
          value: { action: 'loadData' | 'save' | 'updated' | 'createPDF'; row?: number; nextInsertionRow?: number };
      }
    | { type: 'setNbRenters'; value: number }
    | { type: 'setSelectedRenter'; value: number }
    | { type: 'setInfo'; value: Info }
    | { type: 'setDates'; value: Dates }
    | { type: 'setPrices'; value: Prices }
    | { type: 'setOptions'; value: Options }
    | { type: 'setDocument'; value: Document }
    | { type: 'resetToInitialState' }
    | { type: 'loadDataToState'; value: Array<string> }
    | { type: 'setMenuSelected'; value: 'form' | 'table' };

type contextProp = {
    dispatch: React.Dispatch<Action>;
    state: LocaBnBApp;
};

export const RenterContext = React.createContext({} as contextProp);

const locabnbIS: LocaBnBApp = {
    info: {} as Info,
    dates: {} as Dates,
    prices: {} as Prices,
    options: {} as Options,
    document: {} as Document,
    loadDataToState: {} as Array<string>,
    status: { googleState: {} } as State,
    menuSelected: 'table',
};

function locabnbReducer(state: LocaBnBApp, action: Action) {
    switch (action.type) {
        case 'setGoogleConnected':
            return {
                ...state,
                status: {
                    ...state.status,
                    googleState: {
                        ...state.status.googleState,
                        connected: action.value,
                    },
                },
            };
        case 'enableTableMenu':
            return {
                ...state,
                status: {
                    ...state.status,
                    googleState: {
                        ...state.status.googleState,
                        gsheet: action.value,
                    },
                },
            };
        case 'action':
            return {
                ...state,
                status: {
                    ...state.status,
                    action: action.value.action,
                    row: action.value.row ?? state.status.row,
                },
            };
        case 'setSelectedRenter':
            return {
                ...state,
                status: {
                    ...state.status,
                    row: action.value,
                },
            };
        case 'setNbRenters':
            return {
                ...state,
                status: {
                    ...state.status,
                    nextInsertionRow: action.value + 2,
                },
            };
        case 'setInfo':
            return {
                ...state,
                info: action.value,
            };
        case 'setDates':
            return {
                ...state,
                dates: action.value,
            };
        case 'setPrices':
            return {
                ...state,
                prices: action.value,
            };
        case 'setOptions':
            return {
                ...state,
                options: action.value,
            };
        case 'setDocument':
            return {
                ...state,
                document: action.value,
            };
        case 'loadDataToState':
            return {
                ...state,
                loadDataToState: action.value,
            };
        case 'resetToInitialState':
            return {
                ...locabnbIS,
                loadDataToState: {} as Array<string>,
                status: {
                    ...locabnbIS.status,
                    nextInsertionRow: state.status.nextInsertionRow,
                    googleState: state.status.googleState,
                },
            };
        case 'setMenuSelected':
            return {
                ...state,
                menuSelected: action.value,
            };
        default:
            return state;
    }
}

const App = (): JSX.Element => {
    console.log('App component rendered');

    const [locaBnBAppState, dispatch] = useReducer(locabnbReducer, locabnbIS);

    return (
        <>
            <RenterContext.Provider value={{ state: locaBnBAppState, dispatch }}>
                <MenuComponent />
            </RenterContext.Provider>

            <div className="appContainer">
                <div id="table" className={`${locaBnBAppState.menuSelected === 'table' ? 'visible' : 'invisible'}`}>
                    <RenterContext.Provider value={{ state: locaBnBAppState, dispatch }}>
                        <GoogleSheet />
                    </RenterContext.Provider>
                </div>

                <div id="form" className={`form ${locaBnBAppState.menuSelected === 'table' ? 'invisible' : 'visible'}`}>
                    <RenterContext.Provider value={{ state: locaBnBAppState, dispatch }}>
                        <InfoCard />
                        <DatesCard />
                        <PricesCard />
                        <OptionsCard />
                        <DocumentCard />
                        <ActionMenu />
                    </RenterContext.Provider>
                </div>
            </div>
        </>
    );
};

export default App;
