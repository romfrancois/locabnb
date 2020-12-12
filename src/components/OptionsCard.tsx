import React, { useContext, useEffect, useState } from 'react';

import nanoid from 'nanoid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks } from '@fortawesome/free-solid-svg-icons';

import { RenterContext } from '../App';
import { Options } from '../types/Options';

let componentID = nanoid(10);

const OptionsCard = (): JSX.Element => {
    console.log('OptionsCard');
    const { dispatch } = useContext(RenterContext);

    const {
        state: { options },
    } = useContext(RenterContext);

    const {
        state: { loadDataToState },
    } = useContext(RenterContext);

    const sizeOfOptions = Object.keys(options).length;
    const [optionsCard, setOptionsCard] = useState(sizeOfOptions !== 0 ? options : ({} as Options));

    useEffect(() => {
        let updatedData = {} as Options;

        if (loadDataToState.length > 0) {
            console.log('HERE: ', loadDataToState);
            const cleaning = Number(loadDataToState[17]);
            const sheets = Number(loadDataToState[18]);

            updatedData = {
                cleaning: Number.isNaN(cleaning) ? 0 : cleaning,
                sheets: Number.isNaN(sheets) ? 0 : sheets,
            };
        }

        componentID = nanoid(10);
        setOptionsCard(updatedData);
    }, [loadDataToState]);

    useEffect(() => {
        dispatch({ type: 'setOptions', value: optionsCard });
    }, [dispatch, optionsCard]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
        const { name, value } = e.target;

        switch (name) {
            case 'cleaning':
                setOptionsCard({ ...optionsCard, cleaning: Number(value) });
                break;
            case 'sheets':
                setOptionsCard({ ...optionsCard, sheets: Number(value) });
                break;
            default:
                break;
        }
    };

    return (
        <>
            <div className="optionsCard" key={`${componentID}`}>
                <header>
                    <FontAwesomeIcon className="faStyle fa-3x" icon={faTasks} />
                    <span>Options</span>
                </header>
                <div className="options">
                    <div className="cleaning">
                        <div className={`labelFees ${optionsCard.cleaning > 0 ? 'visible' : 'unvisible'} `}>Ménage</div>
                        <input
                            type="number"
                            name="cleaning"
                            id="cleaning"
                            placeholder="Ménage"
                            className="input-med"
                            onChange={handleOnChange}
                            defaultValue={optionsCard.cleaning === 0 ? 'Ménage' : optionsCard.cleaning}
                        />
                    </div>
                    <div className="sheets">
                        <div className={`labelFees ${optionsCard.sheets > 0 ? 'visible' : 'unvisible'} `}>
                            Draps & Linges de bain
                        </div>
                        <input
                            type="number"
                            name="sheets"
                            id="sheets"
                            placeholder="Draps & Linges de bain"
                            className="input-med"
                            onChange={handleOnChange}
                            defaultValue={optionsCard?.sheets === 0 ? 'Draps & Linges de bain' : optionsCard.sheets}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default OptionsCard;
