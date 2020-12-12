import React, { useContext, useEffect, useState } from 'react';

import nanoid from 'nanoid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import { RenterContext } from '../App';
import { Dates } from '../types/Dates';

let componentID = nanoid(10);

const DatesCard = (): JSX.Element => {
    console.log('DatesCard');
    const { dispatch } = useContext(RenterContext);

    const {
        state: { dates },
    } = useContext(RenterContext);

    const {
        state: { loadDataToState },
    } = useContext(RenterContext);

    const sizeOfDates = Object.keys(dates).length;
    const [datesCard, setDatesCard] = useState(sizeOfDates !== 0 ? dates : ({} as Dates));

    useEffect(() => {
        let updatedData = {} as Dates;

        if (loadDataToState.length > 0) {
            updatedData = {
                start: loadDataToState[12],
                end: loadDataToState[13],
            };
        }

        componentID = nanoid(10);
        setDatesCard(updatedData);
    }, [loadDataToState]);

    useEffect(() => {
        dispatch({ type: 'setDates', value: datesCard });
    }, [dispatch, datesCard]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
        const { name, value } = e.target;

        switch (name) {
            case 'start':
                setDatesCard({ ...datesCard, start: value });
                break;
            case 'end':
                setDatesCard({ ...datesCard, end: value });
                break;
            default:
                break;
        }
    };

    return (
        <>
            {loadDataToState && (
                <div className="datesCard" key={`${componentID}`}>
                    <header>
                        <FontAwesomeIcon className="faStyle fa-3x" icon={faCalendarAlt} />
                        <span>Dates location</span>
                    </header>
                    <div className="dates">
                        <div className="start">
                            <span>Début de la location</span>
                            <input
                                type="datetime-local"
                                name="start"
                                id="start"
                                onChange={handleOnChange}
                                defaultValue={datesCard?.start}
                            />
                        </div>
                        <div className="end">
                            <span>Fin de la location</span>
                            <input
                                type="datetime-local"
                                name="end"
                                id="end"
                                onChange={handleOnChange}
                                defaultValue={datesCard?.end}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DatesCard;
