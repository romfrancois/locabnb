import React, { useContext } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import { faWpforms } from '@fortawesome/free-brands-svg-icons';

import nanoid from 'nanoid';
import { RenterContext } from '../App';
import GoogleConnection from './google/GoogleConnection';

type Action = { type: 'setConnected'; value: boolean };

type contextProp = {
    dispatch: React.Dispatch<Action>;
};
const MenuContext = React.createContext({} as contextProp);

const componentID = nanoid(10);

const MenuComponent = (): JSX.Element => {
    console.log('MenuComponent');
    const { dispatch } = useContext(RenterContext);

    const {
        state: {
            status: { connected },
        },
    } = useContext(RenterContext);

    const handleMenu = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.persist();

        const {
            currentTarget: { name },
        } = e;

        switch (name) {
            case 'setTable':
                dispatch({ type: 'setMenuSelected', value: 'table' });
                break;
            case 'setForm':
                dispatch({ type: 'setMenuSelected', value: 'form' });
                break;
            default:
                break;
        }
    };

    return (
        <>
            <div className="menu" key={`${componentID}`}>
                <button type="submit" name="setForm" onClick={handleMenu}>
                    <FontAwesomeIcon className="faStyle fa-3x" icon={faWpforms} />
                    <span>Formulaire</span>
                </button>

                <button type="submit" name="setTable" onClick={handleMenu} disabled={!connected}>
                    <FontAwesomeIcon className="faStyle fa-3x" icon={faTable} />
                    <span>Table</span>
                </button>

                <MenuContext.Provider value={{ dispatch }}>
                    <GoogleConnection />
                </MenuContext.Provider>
            </div>
        </>
    );
};

export default MenuComponent;
