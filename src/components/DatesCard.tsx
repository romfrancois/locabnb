import React, { useContext, useEffect, useState } from 'react';

import nanoid from 'nanoid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import { RenterContext } from '../App';
import { Dates } from '../types/Dates';

import '../res/css/DatesCard.module.css';

let componentID = nanoid(10);

export const datesCardIS: Dates = {
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
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
            const startDate = loadDataToState[12].split(/\/|\s/);
            const startTime = loadDataToState[13];

            const endDate = loadDataToState[14].split(/\/|\s/);
            const endTime = loadDataToState[15];

            updatedData = {
                startDate: `${startDate?.slice(0, 3).reverse().join('-')}`, // || '2021-01-01'}`,
                startTime, // || '12:00',
                endDate: `${endDate?.slice(0, 3).reverse().join('-')}`, // || '2021-01-01'}`,
                endTime, // || '12:00',
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
                case 'startDate':
                    setDatesCard({ ...datesCard, startDate: value });
                    break;
                case 'startTime':
                    setDatesCard({ ...datesCard, startTime: value });
                    break;
                case 'endDate':
                    setDatesCard({ ...datesCard, endDate: value });
                    break;
                case 'endTime':
                    setDatesCard({ ...datesCard, endTime: value });
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
                <div className="datesCardContainer" key={`${componentID}`}>
                    <header>
                        <FontAwesomeIcon className="faStyle fa-3x" icon={faCalendarAlt} />
                        <span>Dates location</span>
                    </header>
                    <div>
                        <div className="start">
                            <span>Début de la location</span>
                            <input
                                type="date"
                                name="startDate"
                                id="startDate"
                                onBlur={handleOnBlur}
                                defaultValue={datesCard?.startDate}
                                placeholder="Date au format JJ/MM/AAAA"
                            />
                            <input
                                type="time"
                                name="startTime"
                                id="startTime"
                                onBlur={handleOnBlur}
                                defaultValue={datesCard?.startTime}
                                placeholder="Heure au format HH:MM"
                            />
                        </div>
                        <div className="end">
                            <span>Fin de la location</span>
                            <input
                                type="date"
                                name="endDate"
                                id="endDate"
                                onBlur={handleOnBlur}
                                defaultValue={datesCard?.endDate}
                                placeholder="Date au format JJ/MM/AAAA"
                            />
                            <input
                                type="time"
                                name="endTime"
                                id="endTime"
                                onBlur={handleOnBlur}
                                defaultValue={datesCard?.endTime}
                                placeholder="Heure au format HH:MM"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DatesCard;
