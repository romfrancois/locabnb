/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import React, { useContext, useEffect, useState } from 'react';
import nanoid from 'nanoid';
import { store } from 'react-notifications-component';
import BootstrapTable from 'react-bootstrap-table-next';

import { RenterContext } from '../../App';
import { infoCardIS } from '../InfoCard';
import { Info } from '../../types/Info';
import { datesCardIS } from '../DatesCard';
import { documentCardIS } from '../DocumentCard';
import { optionsCardIS } from '../OptionsCard';
import { pricesCardIS } from '../PricesCard';
import { Dates } from '../../types/Dates';
import { Options } from '../../types/Options';
import { Prices } from '../../types/Prices';
import { Document } from '../../types/Document';
import { Contact } from '../../types/Contact';
import { Address } from '../../types/Address';

import '../../res/css/BootStrapTable.module.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

let componentID = nanoid(10);

type TableDataType = {
    row: string;
    id: string;
    prenom: string;
    nom: string;
    ville: string;
    // eslint-disable-next-line camelcase
    debut_Location: string;
    // eslint-disable-next-line camelcase
    heure_Debut: string;
    // eslint-disable-next-line camelcase
    fin_Location: string;
    // eslint-disable-next-line camelcase
    heure_Fin: string;
    prix: string;
    // eslint-disable-next-line camelcase
    pdf_Dispo: string;
    pdfLink: string;
};

const mapRowData2JSONObject = (renters: Array<string>): TableDataType => {
    // console.log('mapRowData2JSONObject: ', renters);

    return {
        row: renters[0],
        id: renters[1],
        prenom: renters[2],
        nom: renters[3],
        ville: renters[6],
        debut_Location: renters[12],
        heure_Debut: renters[13],
        fin_Location: renters[14],
        heure_Fin: renters[15],
        prix: renters[16],
        pdf_Dispo: renters[25]?.length > 0 ? 'OUI' : '',
        pdfLink: renters[25],
    };
};

type userDataProp = {
    data: Map<string, string[]>;
    dispatch: any;
};

const PdfAction = (props: any) => {
    const {
        actions: { click },
    } = props;

    return (
        <>
            <button className="rtl-action-btn-view-btn" type="button" onClick={click}>
                <i>
                    <svg
                        fill="currentColor"
                        width="25"
                        height="25"
                        display="inline-block"
                        viewBox="0 0 20 20"
                        style={{ verticalAlign: 'middle' }}
                    >
                        {' '}
                        <path d="M10 4.4C3.439 4.4 0 9.232 0 10c0 .766 3.439 5.6 10 5.6 6.56 0 10-4.834 10-5.6 0-.768-3.44-5.6-10-5.6zm0 9.907c-2.455 0-4.445-1.928-4.445-4.307 0-2.379 1.99-4.309 4.445-4.309s4.444 1.93 4.444 4.309c0 2.379-1.989 4.307-4.444 4.307zM10 10c-.407-.447.663-2.154 0-2.154-1.228 0-2.223.965-2.223 2.154s.995 2.154 2.223 2.154c1.227 0 2.223-.965 2.223-2.154 0-.547-1.877.379-2.223 0z" />{' '}
                    </svg>
                </i>
            </button>
        </>
    );
};
const EditAction = (props: any) => {
    const {
        actions: { click },
    } = props;

    return (
        <>
            <button className="rtl-action-btn-edit-btn" type="button" onClick={click}>
                <i>
                    <svg
                        fill="currentColor"
                        width="25"
                        height="25"
                        display="inline-block"
                        viewBox="0 0 24 24"
                        style={{ verticalAlign: 'middle' }}
                    >
                        {' '}
                        <path d="M21.561 5.318l-2.879-2.879A1.495 1.495 0 0017.621 2c-.385 0-.768.146-1.061.439L13 6H4a1 1 0 00-1 1v13a1 1 0 001 1h13a1 1 0 001-1v-9l3.561-3.561c.293-.293.439-.677.439-1.061s-.146-.767-.439-1.06zM11.5 14.672L9.328 12.5l6.293-6.293 2.172 2.172-6.293 6.293zm-2.561-1.339l1.756 1.728L9 15l-.061-1.667zM16 19H5V8h6l-3.18 3.18c-.293.293-.478.812-.629 1.289-.16.5-.191 1.056-.191 1.47V17h3.061c.414 0 1.108-.1 1.571-.29.464-.19.896-.347 1.188-.64L16 13v6zm2.5-11.328L16.328 5.5l1.293-1.293 2.171 2.172L18.5 7.672z" />{' '}
                    </svg>
                </i>
            </button>
        </>
    );
};

type TableAction = {
    pdf: string;
    id: string;
    dispatch: any;
};

const TableActionButton = (props: TableAction) => {
    const { pdf, id, dispatch } = props;

    const handleEdit = () => {
        dispatch({
            type: 'action',
            value: {
                action: 'loadDataForSelectedRenter',
                id,
            },
        });
    };

    const handlePDF = () => {
        if (pdf) {
            window.open(pdf, '_blank');
        }
    };

    return (
        <div className="rtl-action-btn-container customActionButtons">
            <EditAction actions={{ click: handleEdit }} />
            {pdf && <PdfAction actions={{ click: handlePDF }} />}
        </div>
    );
};

function getColumnsDescription({ dispatch }: Omit<userDataProp, 'data'>) {
    const sortFunc = (a: string, b: string, order: 'desc' | 'asc') => {
        const formattedDateA = a.replace(
            /(\d*)\/(\d*)\/(\d*)/,
            (toSkip: string, d: string, m: string, y: string) => `${y}-${m}-${d}`,
        );
        const dateA = new Date(formattedDateA).getTime();

        const formattedDateB = b.replace(
            /(\d*)\/(\d*)\/(\d*)/,
            (toSkip: string, d: string, m: string, y: string) => `${y}-${m}-${d}`,
        );
        const dateB = new Date(formattedDateB).getTime();

        if (order === 'asc') {
            return dateB - dateA;
        }

        return dateA - dateB; // desc
    };

    return [
        {
            dataField: 'row',
            text: 'row',
            hidden: true,
            isDummyField: true,
        },
        {
            dataField: 'key',
            text: 'key',
            hidden: true,
            isDummyField: true,
        },
        {
            dataField: 'name',
            sort: true,
            text: 'Prénom',
        },
        {
            dataField: 'surname',
            sort: true,
            text: 'Nom',
        },
        {
            dataField: 'startDate',
            sort: true,
            text: 'Début de Location',
            sortFunc,
        },
        {
            dataField: 'startTime',
            sort: false,
            text: 'Heure début',
        },
        {
            dataField: 'endDate',
            sort: true,
            text: 'Fin de Location',
            sortFunc,
        },
        {
            dataField: 'endTime',
            sort: false,
            text: 'Heure fin',
        },
        {
            dataField: 'price',
            text: 'Prix',
            headerStyle: () => {
                return { width: '80px' };
            },
        },
        {
            dataField: 'actions',
            sort: false,
            text: 'Actions',
            formatter: (actions: { pdf: string; id: string }) => {
                const { pdf, id } = actions;

                return <TableActionButton pdf={pdf} id={id} dispatch={dispatch} />;
            },
        },
    ];
}

function UserData({ data, dispatch }: userDataProp) {
    const dataForTable: Array<TableDataType> = [];
    const dataForTable2: Array<any> = [];

    if (data) {
        data.forEach((value, key) => {
            console.log(`key1 ${key} | value1 ${value}`);

            dataForTable.push(mapRowData2JSONObject(value));
        });

        data.forEach((value, key) => {
            console.log(`key2 ${key} | value2 ${value}`);

            dataForTable2.push({
                row: value[0],
                key: value[1],
                name: value[2],
                surname: value[3],
                startDate: value[12],
                startTime: value[13],
                endDate: value[14],
                endTime: value[15],
                price: value[16],
                actions: {
                    pdf: value[25],
                    id: value[1],
                    row: value[0],
                },
            });
        });
    }

    return (
        <>
            <BootstrapTable
                bootstrap4
                classes="tableContainer"
                keyField="key"
                columns={getColumnsDescription({ dispatch })}
                data={dataForTable2}
                hover
                striped
                // condensed
                // wrapperClasses="table-responsive"
                headerWrapperClasses="tableHeader"
                // bodyClasses="tableBody"
                noDataIndication="Aucune données chargées!"
            />
        </>
    );
}

const GoogleSheet = (): JSX.Element => {
    console.log('GoogleSheet');
    const { dispatch } = useContext(RenterContext);

    const {
        state: {
            status: {
                googleState: { connected },
                action,
                nextInsertionRow,
                row,
                id,
            },
            info,
            dates,
            document,
            options,
            prices,
        },
    } = useContext(RenterContext);

    const [rawRenters, setRawRenters] = useState<Map<string, string[]>>();

    const [parsedData, setParsedData] = useState<Array<string>>([]);

    const SPREADSHEET_ID = '1he2PWi4NUP_5AuKYhXmLo2chy4lduqzP5XWgRHSnSH8'; // '1dKSCcTzZjuB3twn8C604Ibf8HPj5I0g7-4peFioNbEs';
    const SPREADSHEET_NAME = 'Sheet1';
    const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`;

    useEffect(() => {
        if (connected) {
            dispatch({ type: 'action', value: { action: 'loadData' } });
        }
    }, [connected, dispatch]);

    useEffect(() => {
        const SHEET_STARTING_POINT = 'A1'; // 1st col that defines fixed cols' names
        const SHEET_ENDING_POINT = 'Y'; // Last col to consider in the spreadsheet

        const getLatestRenters = () => {
            console.log('connected? ', connected);
            console.log('action? ', action);

            gapi.client.sheets.spreadsheets.values
                .get({
                    spreadsheetId: SPREADSHEET_ID,
                    range: `${SPREADSHEET_NAME}!${SHEET_STARTING_POINT}:${SHEET_ENDING_POINT}`,
                })
                .then(
                    (response) => {
                        console.log('response: ', response);
                        dispatch({ type: 'enableTableMenu', value: true });

                        const tab: Map<string, Array<string>> = new Map();

                        response.result.values?.shift();

                        response.result.values?.map((values, index) => {
                            const key = values[0];

                            const results = [`${index}`].concat(values);
                            console.log(`key: ${key} || value: ${results}`);
                            tab.set(key, results);
                        });

                        componentID = nanoid(10);
                        return setRawRenters(tab);
                    },
                    (response) => {
                        console.error(`Error: ${response.result.error.message}`);

                        dispatch({ type: 'enableTableMenu', value: false });

                        store.addNotification({
                            title: 'Erreur',
                            message: "Votre compte Google n'a pas l'autorisation d'accès au fichier Excel",
                            type: 'danger',
                            insert: 'top',
                            container: 'top-right',
                            animationIn: ['animate__animated', 'animate__fadeIn'],
                            animationOut: ['animate__animated', 'animate__fadeOut'],
                            dismiss: {
                                duration: 4000,
                                onScreen: true,
                            },
                        });
                    },
                );
        };

        if (connected && action === 'loadData') {
            getLatestRenters();
        }
    }, [dispatch, connected, action]);

    useEffect(() => {
        console.log('rawRenters: ', rawRenters?.size);

        // if (rawRenters && rawRenters.size > 0) {
        dispatch({ type: 'setNbRenters', value: rawRenters?.size || 0 });
        // }
    }, [dispatch, rawRenters]);

    type AllCardsIS = Info | Address | Contact | Dates | Prices | Options | Document;
    type AllCards = Info | Dates | Prices | Options | Document;

    useEffect(() => {
        if (action === 'save' || action === 'createPDF') {
            const parseCard = (cardIS: AllCardsIS, card: AllCards, subProp?: string): Array<string> => {
                const getKeyValue = (key: string) => (obj: Record<string, any>) => obj[key];

                const dataInit: Array<string | Array<string>> = [];
                for (const property in cardIS) {
                    if (property === 'address') {
                        dataInit.push(parseCard(infoCardIS.address, card, property));
                    } else if (property === 'contact') {
                        dataInit.push(parseCard(infoCardIS.contact, card, property));
                    } else if (subProp) {
                        if (Object.prototype.hasOwnProperty.call(card, subProp)) {
                            const subPropValue = getKeyValue(subProp)(card)[property];
                            if (subPropValue) {
                                dataInit.push(subPropValue);
                            } else {
                                dataInit.push('');
                            }
                        } else {
                            dataInit.push('');
                        }
                    } else if (Object.prototype.hasOwnProperty.call(card, property)) {
                        const currentData = getKeyValue(property)(card);
                        dataInit.push(currentData);
                    } else {
                        dataInit.push('');
                    }
                }

                return dataInit.flat();
            };

            const parseAllCards = (): Array<string> => {
                let data2Backup: Array<string> = [nanoid(10)];

                data2Backup = data2Backup.concat(parseCard(infoCardIS, info));
                data2Backup = data2Backup.concat(parseCard(datesCardIS, dates));
                data2Backup = data2Backup.concat(parseCard(pricesCardIS, prices));
                data2Backup = data2Backup.concat(parseCard(optionsCardIS, options));
                data2Backup = data2Backup.concat(parseCard(documentCardIS, document));

                return data2Backup;
            };

            const data2Backup: Array<string> = parseAllCards();
            // console.log('data2Backup: ', data2Backup);
            setParsedData(data2Backup);
        }
    }, [action, dates, document, info, options, prices]);

    useEffect(() => {
        if ((action === 'save' || action === 'createPDF') && parsedData.length > 0) {
            console.log('Action is: ', action, parsedData, parsedData.length);

            const data2Backup: Array<string> = action === 'createPDF' ? parsedData.concat(['DEMANDE_PDF']) : parsedData;
            console.log('data2Backup: ', data2Backup);

            const body = {
                values: [data2Backup.flat()],
            };

            const whereToUpdateInsert = row || nextInsertionRow;

            gapi.client.sheets.spreadsheets.values
                .update({
                    spreadsheetId: SPREADSHEET_ID,
                    range: `${SPREADSHEET_NAME}!A${whereToUpdateInsert}`,
                    valueInputOption: 'RAW',
                    resource: body,
                })
                .then((response) => {
                    console.log('response: ', response);

                    if (response.status === 200) {
                        const title = action === 'createPDF' ? 'PDF généré et enregistré' : 'Location enregistrée';
                        const message =
                            action === 'createPDF'
                                ? 'Le fichier PDF est maintenant disponible depuis Drive/Table'
                                : 'La location est correctement enregistrée dans le fichier Excel';

                        store.addNotification({
                            title,
                            message,
                            type: 'success',
                            insert: 'top',
                            container: 'top-right',
                            animationIn: ['animate__animated', 'animate__fadeIn'],
                            animationOut: ['animate__animated', 'animate__fadeOut'],
                            dismiss: {
                                duration: 5000,
                                onScreen: true,
                            },
                            onRemoval: () => {
                                dispatch({ type: 'action', value: { action: 'loadData' } });
                            },
                        });
                    } else {
                        const title =
                            action === 'createPDF'
                                ? 'Erreur pendant la création du PDF'
                                : "Erreur dans l'enregistrement";
                        const message =
                            action === 'createPDF'
                                ? "Le fichier PDF n'a pas pu être correctement généré"
                                : "La location n'a pas pu être correctement enregistrée dans le fichier Excel";

                        store.addNotification({
                            title,
                            message,
                            type: 'danger',
                            insert: 'top',
                            container: 'top-right',
                            animationIn: ['animate__animated', 'animate__fadeIn'],
                            animationOut: ['animate__animated', 'animate__fadeOut'],
                            dismiss: {
                                duration: 5000,
                                onScreen: true,
                            },
                        });
                    }
                });
        }
    }, [action, dispatch, nextInsertionRow, parsedData, row]);

    useEffect(() => {
        if (action === 'loadDataForSelectedRenter' && id) {
            console.log('Action is: ', action);

            const retrievedDataForRenter = rawRenters?.get(id);
            if (retrievedDataForRenter) {
                dispatch({ type: 'loadDataToState', value: retrievedDataForRenter });
                dispatch({ type: 'setMenuSelected', value: 'form' });
            }
        }
    }, [action, dispatch, id, rawRenters]);

    return (
        <>
            {rawRenters && (
                <div className="gsheetCard" key={`${componentID}`}>
                    <a href={SPREADSHEET_URL} target="_blank" rel="noopener noreferrer">
                        Lien vers le fichier Excel
                    </a>
                    {UserData({ data: rawRenters, dispatch })}
                </div>
            )}
        </>
    );
};

export default GoogleSheet;
