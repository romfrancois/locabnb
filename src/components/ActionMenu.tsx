import React, { useContext } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faSave, faFilePdf } from '@fortawesome/free-solid-svg-icons';

import nanoid from 'nanoid';

import { RenterContext } from '../App';

import '../res/css/index.module.css';

const componentID = nanoid(10);

const ActionMenu = (): JSX.Element => {
    console.log(`ActionMenu`);
    const { dispatch } = useContext(RenterContext);

    const {
        state: { status, info },
    } = useContext(RenterContext);

    const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.persist();

        const {
            currentTarget: { name },
        } = e;

        switch (name) {
            case 'resetData':
                dispatch({ type: 'resetToInitialState' });
                break;
            case 'saveData':
                console.log('Saving Data!');
                dispatch({
                    type: 'action',
                    value: {
                        action: 'save',
                        nextInsertionRow: status.nextInsertionRow,
                        row: status.row,
                    },
                });

                dispatch({ type: 'enableTableMenu', value: false });
                break;
            case 'generatePDF':
                dispatch({
                    type: 'action',
                    value: {
                        action: 'createPDF',
                    },
                });
                break;
            default:
                break;
        }
    };

    return (
        <>
            <div className="menuButtons" key={`${componentID}`}>
                <button type="submit" name="resetData" onClick={handleOnClick}>
                    <FontAwesomeIcon className="faStyle fa-3x" icon={faFile} />
                    <span>Remettre à zéro le formulaire</span>
                </button>

                <button type="submit" name="saveData" onClick={handleOnClick} disabled={Object.keys(info).length <= 0}>
                    <FontAwesomeIcon className="faStyle fa-3x" icon={faSave} />
                    <span>Enregistrer la location</span>
                </button>

                <button type="submit" name="generatePDF" onClick={handleOnClick}>
                    <FontAwesomeIcon className="faStyle fa-3x" icon={faFilePdf} />
                    <span>Générer le pdf</span>
                </button>
            </div>
        </>
    );
};

export default ActionMenu;
