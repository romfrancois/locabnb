import React, { useContext, useEffect, useState } from 'react';

import nanoid from 'nanoid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks } from '@fortawesome/free-solid-svg-icons';

import { RenterContext } from '../App';
import { Options } from '../types/Options';

import optionsCss from '../res/css/OptionsCard.module.scss';

let componentID = nanoid(10);

export const optionsCardIS: Options = {
    cleaning: 0,
    sheets: 0,
};

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
    const [optionsCard, setOptionsCard] = useState(sizeOfOptions !== 0 ? options : optionsCardIS);

    useEffect(() => {
        let updatedData = {} as Options;

        if (loadDataToState.length > 0) {
            const cleaning = Number(loadDataToState[19]);
            const sheets = Number(loadDataToState[20]);

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

    const handleOnBlur = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
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
        },
        [optionsCard],
    );

    return (
        <>
            <div className={optionsCss.main} key={`${componentID}`}>
                <header>
                    <FontAwesomeIcon className="faStyle fa-3x" icon={faTasks} />
                    <span>Options</span>
                </header>
                <div>
                    <div className={optionsCss.cleaning}>
                        <div className={`${optionsCard.cleaning > 0 ? optionsCss.visible : optionsCss.invisible} `}>
                            Ménage
                        </div>
                        <input
                            type="number"
                            name="cleaning"
                            id="cleaning"
                            placeholder="Ménage"
                            className="input-med"
                            onBlur={handleOnBlur}
                            defaultValue={optionsCard.cleaning === 0 ? 'Ménage' : optionsCard.cleaning}
                        />
                    </div>
                    <div className={optionsCss.sheets}>
                        <div className={`${optionsCard.sheets > 0 ? optionsCss.visible : optionsCss.invisible} `}>
                            Draps & Linges de bain
                        </div>
                        <input
                            type="number"
                            name="sheets"
                            id="sheets"
                            placeholder="Draps & Linges de bain"
                            className="input-med"
                            onBlur={handleOnBlur}
                            defaultValue={optionsCard?.sheets === 0 ? 'Draps & Linges de bain' : optionsCard.sheets}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default OptionsCard;
