import React, { useContext, useEffect, useState } from 'react';

import nanoid from 'nanoid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import { RenterContext } from '../App';
import { Dates } from '../types/Dates';

let componentID = nanoid(10);

export const datesCardIS: Dates = {
    start: '',
    end: '',
};

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
    const [datesCard, setDatesCard] = useState(sizeOfDates !== 0 ? dates : datesCardIS);

    useEffect(() => {
        let updatedData = {} as Dates;

        if (loadDataToState.length > 0) {
            const start = loadDataToState[12].split(/\/|\s/);
            const end = loadDataToState[13].split(/\/|\s/);

            updatedData = {
                start: `${start.slice(0, 3).reverse().join('-')}T${start[3]?.slice(0, 5) || '12:00'}`,
                end: `${end.slice(0, 3).reverse().join('-')}T${end[3]?.slice(0, 5) || '12:00'}`,
            };
        }

        componentID = nanoid(10);
        setDatesCard(updatedData);
    }, [loadDataToState]);

    useEffect(() => {
        dispatch({ type: 'setDates', value: datesCard });
    }, [dispatch, datesCard]);

    const handleOnBlur = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
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
        },
        [datesCard],
    );

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
                                onBlur={handleOnBlur}
                                defaultValue={datesCard?.start}
                            />
                        </div>
                        <div className="end">
                            <span>Fin de la location</span>
                            <input
                                type="datetime-local"
                                name="end"
                                id="end"
                                onBlur={handleOnBlur}
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
