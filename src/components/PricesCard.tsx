import React, { useContext, useEffect, useState } from 'react';

import nanoid from 'nanoid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentsDollar } from '@fortawesome/free-solid-svg-icons';

import { RenterContext } from '../App';
import { Prices } from '../types/Prices';

import pricesCss from '../res/css/PricesCard.module.css';

let componentID = nanoid(10);

export const pricesCardIS: Prices = {
    price: 0,
    arrhes: 0,
    garantie: 0,
};

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
    const [pricesCard, setPricesCard] = useState(sizeOfPrices !== 0 ? prices : pricesCardIS);

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

    const handleOnBlur = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
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
        },
        [pricesCard],
    );

    return (
        <>
            <div className={pricesCss.main} key={`${componentID}`}>
                <header>
                    <FontAwesomeIcon className="faStyle fa-3x" icon={faCommentsDollar} />
                    <span>Prix location</span>
                </header>
                <div className={pricesCss.prices}>
                    <div className={pricesCss.price}>
                        <div className={`${pricesCard.price > 0 ? pricesCss.visible : pricesCss.invisible} `}>Prix</div>
                        <input
                            type="number"
                            name="price"
                            id="price"
                            placeholder="Prix"
                            className="input-med"
                            onBlur={handleOnBlur}
                            defaultValue={pricesCard?.price === 0 ? 'Prix' : pricesCard.price}
                        />
                    </div>
                    <div className={pricesCss.arrhes}>
                        <div className={`${pricesCard.arrhes > 0 ? pricesCss.visible : pricesCss.invisible} `}>
                            Arrhes
                        </div>
                        <input
                            type="number"
                            name="arrhes"
                            id="arrhes"
                            placeholder="Arrhes"
                            className="input-med"
                            onBlur={handleOnBlur}
                            defaultValue={pricesCard?.arrhes === 0 ? 'Arrhes' : pricesCard.arrhes}
                        />
                    </div>
                    <div className={pricesCss.garantie}>
                        <div className={`${pricesCard.garantie > 0 ? pricesCss.visible : pricesCss.invisible} `}>
                            Garantie
                        </div>
                        <input
                            type="number"
                            name="garantie"
                            id="garantie"
                            placeholder="Garantie"
                            className="input-med"
                            onBlur={handleOnBlur}
                            defaultValue={pricesCard?.garantie === 0 ? 'Garantie' : pricesCard.garantie}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PricesCard;
