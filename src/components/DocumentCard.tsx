import React, { useContext, useEffect, useState, ChangeEvent } from 'react';

import nanoid from 'nanoid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileSignature } from '@fortawesome/free-solid-svg-icons';

import { RenterContext } from '../App';
import { Document, Languages, Locations, Origins } from '../types/Document';

import documentCss from '../res/css/DocumentCard.module.css';

let componentID = nanoid(10);

export const documentCardIS: Document = {
    language: Languages.FR,
    location: Locations.BELLEGARDE,
    origin: Origins.AIRBNB,
};

type componentProp = {
    title: string;
    propType: typeof Languages | typeof Locations | typeof Origins;
    name: string;
    onBlur: (event: ChangeEvent<HTMLSelectElement>) => void;
    initialValue: string;
};

const DocumentComponent = ({ title, propType, name, onBlur, initialValue }: componentProp) => {
    return (
        <div className={documentCss.subProp}>
            <span>{title}</span>
            <select
                id={name}
                name={name}
                className={documentCss['input-sm']}
                onBlur={onBlur}
                defaultValue={initialValue}
            >
                {Object.keys(propType).map((_key) => (
                    <option key={_key} value={_key}>
                        {_key}
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

    const handleOnBlur = React.useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>): void => {
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
        },
        [documentCard],
    );

    useEffect(() => {
        let updatedData = documentCardIS;

        if (loadDataToState.length > 0) {
            updatedData = {
                language: loadDataToState[21] as Languages,
                location: loadDataToState[22] as Locations,
                origin: loadDataToState[23] as Origins,
            };
        }

        componentID = nanoid(10);
        setDocumentCard(updatedData);
    }, [loadDataToState]);

    useEffect(() => {
        dispatch({ type: 'setDocument', value: documentCard });
    }, [dispatch, documentCard]);

    return (
        <div className={documentCss.main} key={`${componentID}`}>
            <header>
                <FontAwesomeIcon className="faStyle fa-3x" icon={faFileSignature} />
                <span>Document</span>
            </header>
            <div>
                <DocumentComponent
                    title="Langue du contrat"
                    propType={Languages}
                    name="language"
                    onBlur={handleOnBlur}
                    initialValue={documentCard.language}
                />

                <DocumentComponent
                    title="Endroit de la location"
                    propType={Locations}
                    name="location"
                    onBlur={handleOnBlur}
                    initialValue={documentCard.location}
                />

                <DocumentComponent
                    title="Site de la résa"
                    propType={Origins}
                    name="origin"
                    onBlur={handleOnBlur}
                    initialValue={documentCard.origin}
                />
            </div>
        </div>
    );
};

export default DocumentCard;
