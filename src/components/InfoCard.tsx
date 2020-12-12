import React, { useContext, useEffect, useState } from 'react';

import nanoid from 'nanoid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

import { Info } from '../types/Info';
import { Address } from '../types/Address';
import { Contact } from '../types/Contact';

import { RenterContext } from '../App';
import { Country } from '../types/Country';

let componentID = nanoid(10);

const infoCardIS: Info = {
    name: '',
    surname: '',
    nbPersones: '',
    kids: '',
    address: {} as Address,
    contact: {} as Contact,
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
                nbPersones: loadDataToState[4],
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

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
        const { name, value } = e.target;
        switch (name) {
            case 'name':
                setInfoCard({ ...infoCard, name: value });
                break;
            case 'surname':
                setInfoCard({ ...infoCard, surname: value });
                break;
            case 'people':
                setInfoCard({ ...infoCard, nbPersones: value });
                break;
            case 'kids':
                setInfoCard({ ...infoCard, kids: value });
                break;
            case 'address':
                setInfoCard({ ...infoCard, address: { ...infoCard.address, street: value } });
                break;
            case 'postCode':
                setInfoCard({ ...infoCard, address: { ...infoCard.address, postCode: value } });
                break;
            case 'city':
                setInfoCard({ ...infoCard, address: { ...infoCard.address, city: value } });
                break;
            case 'country':
                setInfoCard({ ...infoCard, address: { ...infoCard.address, country: value as Country } });
                break;
            case 'email':
                setInfoCard({ ...infoCard, contact: { ...infoCard.contact, email: value } });
                break;
            case 'tel':
                setInfoCard({ ...infoCard, contact: { ...infoCard.contact, phone: value } });
                break;
            default:
                break;
        }
    };

    return (
        <>
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
                            onChange={handleOnChange}
                            defaultValue={infoCard?.name}
                        />
                        <input
                            type="text"
                            name="surname"
                            id="surname"
                            placeholder="Nom"
                            onChange={handleOnChange}
                            defaultValue={infoCard?.surname}
                        />
                    </div>
                    <div className="people">
                        <input
                            type="text"
                            name="people"
                            id="people"
                            placeholder="Nb de personnes"
                            onChange={handleOnChange}
                            defaultValue={infoCard?.nbPersones}
                        />
                        <input
                            type="text"
                            name="kids"
                            id="kids"
                            placeholder="Age des enfants"
                            onChange={handleOnChange}
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
                            className="addr"
                            onChange={handleOnChange}
                            defaultValue={infoCard?.address?.street}
                        />
                    </div>
                    <div className="additional">
                        <input
                            type="text"
                            name="postCode"
                            id="postCode"
                            placeholder="Code Postal"
                            className="addr input-med"
                            onChange={handleOnChange}
                            defaultValue={infoCard?.address?.postCode}
                        />
                        <input
                            type="text"
                            name="city"
                            id="city"
                            placeholder="Ville"
                            className="addr input-med"
                            onChange={handleOnChange}
                            defaultValue={infoCard?.address?.city}
                        />
                        <select
                            id="country"
                            name="country"
                            placeholder="Pays"
                            className="input-sm"
                            onChange={handleOnChange}
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
                        onChange={handleOnChange}
                        defaultValue={infoCard?.contact?.email}
                    />
                    <input
                        type="tel"
                        name="tel"
                        id="tel"
                        placeholder="Téléphone"
                        onChange={handleOnChange}
                        defaultValue={infoCard?.contact?.phone}
                    />
                </div>
            </div>
        </>
    );
};

export default InfoCard;
