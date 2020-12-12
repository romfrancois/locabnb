import React, { useContext, useEffect, useState, ChangeEvent } from 'react';

import nanoid from 'nanoid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileSignature } from '@fortawesome/free-solid-svg-icons';

import { RenterContext } from '../App';
import { Document, Languages, Locations, Origins } from '../types/Document';

let componentID = nanoid(10);

const documentCardIS: Document = {
    language: Languages.FR,
    location: Locations.BELLEGARDE,
    origin: Origins.AIRBNB,
};

type subComponentProp = {
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    initialValue: Languages | Locations | Origins;
};

const LanguagesComponent = ({ onChange, initialValue }: subComponentProp) => {
    return (
        <div className="language">
            <span>Langue du contrat</span>
            <select id="language" name="language" className="input-sm" onChange={onChange} defaultValue={initialValue}>
                {Object.keys(Languages).map((language) => (
                    <option key={language} defaultValue={initialValue}>
                        {language}
                    </option>
                ))}
            </select>
        </div>
    );
};

const LocationsComponent = ({ onChange, initialValue }: subComponentProp) => {
    return (
        <div className="location">
            <span>Endroit de la location</span>
            <select id="location" name="location" className="input-sm" onChange={onChange} defaultValue={initialValue}>
                {Object.keys(Locations).map((location) => (
                    <option key={location} value={location}>
                        {location}
                    </option>
                ))}
            </select>
        </div>
    );
};
const OriginsComponent = ({ onChange, initialValue }: subComponentProp) => {
    return (
        <div className="origin">
            <span>Site de la résa</span>
            <select id="origin" name="origin" className="input-sm" onChange={onChange} defaultValue={initialValue}>
                {Object.keys(Origins).map((origin) => (
                    <option key={origin} value={origin}>
                        {origin}
                    </option>
                ))}
            </select>
        </div>
    );
};

const DocumentCard = (): JSX.Element => {
    console.log('DocumentCard');
    const { dispatch } = useContext(RenterContext);

    const { state } = useContext(RenterContext);
    const { document }: { document: Document } = state;

    const {
        state: { loadDataToState },
    } = useContext(RenterContext);

    const sizeOfDocument = Object.keys(document).length;
    const [documentCard, setDocumentCard] = useState(sizeOfDocument !== 0 ? document : documentCardIS);

    const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const { name, value } = e.target;

        switch (name) {
            case 'language':
                setDocumentCard({ ...documentCard, language: value as Languages });
                break;
            case 'location':
                setDocumentCard({ ...documentCard, location: value as Locations });
                break;
            case 'origin':
                setDocumentCard({ ...documentCard, origin: value as Origins });
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        let updatedData = documentCardIS;

        if (loadDataToState.length > 0) {
            updatedData = {
                language: loadDataToState[19] as Languages,
                location: loadDataToState[20] as Locations,
                origin: loadDataToState[21] as Origins,
            };
        }

        componentID = nanoid(10);
        setDocumentCard(updatedData);
    }, [loadDataToState]);

    useEffect(() => {
        dispatch({ type: 'setDocument', value: documentCard });
    }, [dispatch, documentCard]);

    return (
        <>
            <div className="documentCard" key={`${componentID}`}>
                <header>
                    <FontAwesomeIcon className="faStyle fa-3x" icon={faFileSignature} />
                    <span>Document</span>
                </header>
                <div className="document">
                    <LanguagesComponent onChange={handleOnChange} initialValue={documentCard.language} />
                    <LocationsComponent onChange={handleOnChange} initialValue={documentCard.location} />
                    <OriginsComponent onChange={handleOnChange} initialValue={documentCard.origin} />
                </div>
            </div>
        </>
    );
};

export default DocumentCard;
