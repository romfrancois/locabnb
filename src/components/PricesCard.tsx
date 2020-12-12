import React, { useContext, useEffect, useState } from 'react';

import nanoid from 'nanoid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentsDollar } from '@fortawesome/free-solid-svg-icons';

import { RenterContext } from '../App';
import { Prices } from '../types/Prices';

let componentID = nanoid(10);

const PricesCard = (): JSX.Element => {
    console.log('PricesCard');
    const { dispatch } = useContext(RenterContext);

    const {
        state: { prices },
    } = useContext(RenterContext);

    const {
        state: { loadDataToState },
    } = useContext(RenterContext);

    const sizeOfPrices = Object.keys(prices).length;
    const [pricesCard, setPricesCard] = useState(sizeOfPrices !== 0 ? prices : ({} as Prices));

    useEffect(() => {
        let updatedData = {} as Prices;

        if (loadDataToState.length > 0) {
            const price = Number(loadDataToState[14]);
            const arrhes = Number(loadDataToState[15]);
            const garantie = Number(loadDataToState[16]);

            updatedData = {
                price: Number.isNaN(price) ? 0 : price,
                arrhes: Number.isNaN(arrhes) ? 0 : arrhes,
                garantie: Number.isNaN(garantie) ? 0 : garantie,
            };
        }

        componentID = nanoid(10);
        setPricesCard(updatedData);
    }, [loadDataToState]);

    useEffect(() => {
        dispatch({ type: 'setPrices', value: pricesCard });
    }, [dispatch, pricesCard]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
        const { name, value } = e.target;

        switch (name) {
            case 'price':
                setPricesCard({ ...pricesCard, price: Number(value) });
                break;
            case 'arrhes':
                setPricesCard({ ...pricesCard, arrhes: Number(value) });
                break;
            case 'garantie':
                setPricesCard({ ...pricesCard, garantie: Number(value) });
                break;
            default:
                break;
        }
    };

    return (
        <>
            <div className="pricesCard" key={`${componentID}`}>
                <header>
                    <FontAwesomeIcon className="faStyle fa-3x" icon={faCommentsDollar} />
                    <span>Prix location</span>
                </header>
                <div className="prices">
                    <div className="price">
                        <div className={`labelFees ${pricesCard.price > 0 ? 'visible' : 'unvisible'} `}>Prix</div>
                        <input
                            type="number"
                            name="price"
                            id="price"
                            placeholder="Prix"
                            className="input-med"
                            onChange={handleOnChange}
                            defaultValue={pricesCard?.price === 0 ? 'Prix' : pricesCard.price}
                        />
                    </div>
                    <div className="arrhes">
                        <div className={`labelFees ${pricesCard.arrhes > 0 ? 'visible' : 'unvisible'} `}>Arrhes</div>
                        <input
                            type="number"
                            name="arrhes"
                            id="arrhes"
                            placeholder="Arrhes"
                            className="input-med"
                            onChange={handleOnChange}
                            defaultValue={pricesCard?.arrhes === 0 ? 'Arrhes' : pricesCard.arrhes}
                        />
                    </div>
                    <div className="garantie">
                        <div className={`labelFees ${pricesCard.garantie > 0 ? 'visible' : 'unvisible'} `}>
                            Garantie
                        </div>
                        <input
                            type="number"
                            name="garantie"
                            id="garantie"
                            placeholder="Garantie"
                            className="input-med"
                            onChange={handleOnChange}
                            defaultValue={pricesCard?.garantie === 0 ? 'Garantie' : pricesCard.garantie}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PricesCard;
