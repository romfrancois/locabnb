import React, { useContext, useEffect, useState } from 'react';

import nanoid from 'nanoid';
import { capitalize, startCase, toLower, toUpper } from 'lodash';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

import { Info } from '../types/Info';
import { Address } from '../types/Address';
import { Contact } from '../types/Contact';

import { RenterContext } from '../App';
import { Country } from '../types/Country';

let componentID = nanoid(10);

const address: Address = {
    street: '',
    postCode: '',
    city: '',
    country: '' as Country,
};

const contact: Contact = {
    email: '',
    phone: '',
};

export const infoCardIS: Info = {
    name: '',
    surname: '',
    nbPersonnes: '',
    kids: '',
    address,
    contact,
};

const InfoCard = (): JSX.Element => {
    console.log('InfoCard');
    const { dispatch } = useContext(RenterContext);

    const {
        state: { info },
    } = useContext(RenterContext);

    const {
        state: { loadDataToState },
    } = useContext(RenterContext);

    const sizeOfInfo = Object.keys(info).length;
    const [infoCard, setInfoCard] = useState(sizeOfInfo !== 0 ? info : infoCardIS);

    useEffect(() => {
        let updatedData = {} as Info;

        if (loadDataToState.length > 0) {
            updatedData = {
                name: loadDataToState[2],
                surname: loadDataToState[3],
                nbPersonnes: loadDataToState[4],
                kids: loadDataToState[5],
                address: {
                    street: loadDataToState[6],
                    postCode: loadDataToState[7],
                    city: loadDataToState[8],
                    country: loadDataToState[9] as Country,
                },
                contact: {
                    email: loadDataToState[10],
                    phone: loadDataToState[11],
                },
            };
        }

        componentID = nanoid(10);
        setInfoCard(updatedData);
    }, [loadDataToState]);

    useEffect(() => {
        dispatch({ type: 'setInfo', value: infoCard });
    }, [dispatch, infoCard]);

    const handleOnBlur = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
            const { name, value } = e.target;
            switch (name) {
                case 'name':
                    setInfoCard({ ...infoCard, name: capitalize(value) });
                    break;
                case 'surname':
                    setInfoCard({ ...infoCard, surname: capitalize(value) });
                    break;
                case 'people':
                    setInfoCard({ ...infoCard, nbPersonnes: value });
                    break;
                case 'kids':
                    setInfoCard({ ...infoCard, kids: value });
                    break;
                case 'address':
                    setInfoCard({ ...infoCard, address: { ...infoCard.address, street: startCase(value) } });
                    break;
                case 'postCode':
                    setInfoCard({ ...infoCard, address: { ...infoCard.address, postCode: toUpper(value) } });
                    break;
                case 'city':
                    setInfoCard({ ...infoCard, address: { ...infoCard.address, city: startCase(value) } });
                    break;
                case 'country':
                    setInfoCard({ ...infoCard, address: { ...infoCard.address, country: value as Country } });
                    break;
                case 'email':
                    setInfoCard({ ...infoCard, contact: { ...infoCard.contact, email: toLower(value) } });
                    break;
                case 'tel':
                    setInfoCard({ ...infoCard, contact: { ...infoCard.contact, phone: value } });
                    break;
                default:
                    break;
            }
        },
        [infoCard],
    );

    return (
        <div className="infoCard" key={`${componentID}`}>
            <header>
                <FontAwesomeIcon className="faStyle fa-3x" icon={faUsers} />
                <span>Info locataires</span>
            </header>
            <div className="info">
                <div className="renter">
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Prénom"
                        className="info-capitalised"
                        onBlur={handleOnBlur}
                        defaultValue={infoCard?.name}
                    />
                    <input
                        type="text"
                        name="surname"
                        id="surname"
                        placeholder="Nom"
                        className="info-capitalised"
                        onBlur={handleOnBlur}
                        defaultValue={infoCard?.surname}
                    />
                </div>
                <div className="people">
                    <input
                        type="number"
                        name="people"
                        id="people"
                        placeholder="Nb de personnes"
                        onBlur={handleOnBlur}
                        defaultValue={infoCard?.nbPersonnes}
                    />
                    <input
                        type="text"
                        name="kids"
                        id="kids"
                        placeholder="Age des enfants"
                        onBlur={handleOnBlur}
                        defaultValue={infoCard?.kids}
                    />
                </div>
            </div>
            <div className="address">
                <div className="main">
                    <input
                        type="text"
                        name="address"
                        id="address"
                        placeholder="Adresse"
                        className="info-capitalised"
                        onBlur={handleOnBlur}
                        defaultValue={infoCard?.address?.street}
                    />
                </div>
                <div className="additional">
                    <input
                        type="text"
                        name="postCode"
                        id="postCode"
                        placeholder="Code Postal"
                        className="info-uppercase input-med"
                        onBlur={handleOnBlur}
                        defaultValue={infoCard?.address?.postCode}
                    />
                    <input
                        type="text"
                        name="city"
                        id="city"
                        placeholder="Ville"
                        className="info-capitalised input-med"
                        onBlur={handleOnBlur}
                        defaultValue={infoCard?.address?.city}
                    />
                    <select
                        id="country"
                        name="country"
                        placeholder="Pays"
                        className="input-sm"
                        onBlur={handleOnBlur}
                        defaultValue={infoCard?.address?.country}
                    >
                        <option value="NONE">Pays</option>
                        {Object.keys(Country).map((origin) => (
                            <option key={origin} defaultValue={origin}>
                                {origin}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="contact">
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    className="info-lowercase"
                    onBlur={handleOnBlur}
                    defaultValue={infoCard?.contact?.email}
                />
                <input
                    type="tel"
                    name="tel"
                    id="tel"
                    placeholder="Téléphone"
                    onBlur={handleOnBlur}
                    defaultValue={infoCard?.contact?.phone}
                />
            </div>
        </div>
    );
};

export default InfoCard;
