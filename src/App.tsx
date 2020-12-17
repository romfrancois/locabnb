import React, { useEffect, useReducer } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faSave } from '@fortawesome/free-solid-svg-icons';
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

type Action =
    | { type: 'setConnected'; value: boolean }
    | { type: 'setState'; value: { action: 'save' | 'update' | 'updated'; row?: number; nextInsertionRow?: number } }
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
    status: {} as State,
    menuSelected: 'form',
};

function locabnbReducer(state: LocaBnBApp, action: Action) {
    switch (action.type) {
        case 'setConnected':
            return {
                ...state,
                status: {
                    ...state.status,
                    connected: action.value,
                },
            };
        case 'setState':
            return {
                ...state,
                status: {
                    ...state.status,
                    action: action.value.action,
                    row: action.value.row,
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
                status: {
                    ...locabnbIS.status,
                    nextInsertionRow: state.status.nextInsertionRow,
                    connected: state.status.connected,
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
    const [locaBnBAppState, dispatch] = useReducer(locabnbReducer, locabnbIS);

    const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.persist();

        const {
            currentTarget: { name },
        } = e;

        console.log('event: ', name);

        switch (name) {
            case 'resetData':
                dispatch({ type: 'resetToInitialState' });
                break;
            case 'saveData':
                console.log('Saving Data!');
                dispatch({
                    type: 'setState',
                    value: {
                        action: 'save',
                        nextInsertionRow: locaBnBAppState.status.nextInsertionRow,
                        row: locaBnBAppState.status.row,
                    },
                });
                break;
            default:
                break;
        }
    };

    return (
        <>
            <RenterContext.Provider value={{ state: locaBnBAppState, dispatch }}>
                <MenuComponent />
            </RenterContext.Provider>

            <div className="container">
                <div id="table" className={locaBnBAppState.menuSelected === 'table' ? 'visible' : 'invisible'}>
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
                    </RenterContext.Provider>

                    <div className="menuButtons">
                        <button type="submit" name="resetData" onClick={handleOnClick}>
                            <FontAwesomeIcon className="faStyle fa-3x" icon={faFile} />
                            <span>Remettre à zéro le formualaire</span>
                        </button>

                        <button
                            type="submit"
                            name="saveData"
                            onClick={handleOnClick}
                            disabled={Object.keys(locaBnBAppState.info).length <= 0}
                        >
                            <FontAwesomeIcon className="faStyle fa-3x" icon={faSave} />
                            <span>Enregistrer la location</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default App;
