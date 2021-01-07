/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import React, { useContext, useEffect, useState } from 'react';
import Table from 'react-table-lite';
import nanoid from 'nanoid';
import { store } from 'react-notifications-component';

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

let componentID = nanoid(10);

type tableDataType = {
    row: string;
    id: string;
    name: string;
    surname: string;
    city: string;
    start: string;
    end: string;
    price: string;
    selected: false;
    selectDisabled: true;
};

const mapRowData2JSONObject = (renters: Array<string>): tableDataType => {
    // console.log('mapRowData2JSONObject: ', renters);

    return {
        row: renters[0],
        id: renters[1],
        name: renters[2],
        surname: renters[3],
        city: renters[6],
        start: renters[12],
        end: renters[13],
        price: renters[14],
        selected: false,
        selectDisabled: true,
    };
};

type userDataProp = {
    data: Map<string, string[]>;
    dispatch: any;
};

function UserData({ data, dispatch }: userDataProp) {
    const dataForTable: Array<tableDataType> = [];
    const tab: Map<string, Array<string>> = new Map();

    if (data) {
        data.forEach((value, key) => {
            dataForTable.push(mapRowData2JSONObject(value));
            tab.set(key, value);
        });
    }

    const headerStyle = {
        color: 'grey',
    };
    const dataStyle = {
        color: 'white',
    };

    return (
        <Table
            data={dataForTable}
            // Array of JSONObjects(required)
            // 'id',
            header={['name', 'surname', 'start', 'end', 'price']}
            // Headers should be same as data JSON Object's keys (required)
            // sortBy={['name', 'surname']}
            // keys for sorting should be present in header array
            // searchable
            // Enable table search field
            // searchBy={['name']}
            // keys for sorting should be present in header array
            // download
            // Pass true to enable download button
            // note: If multiselect is enabled,
            // only checked rows will be downloaded
            fileName="Table_Data"
            // Default name of downloaded csv file
            noDataMessage="Aucune données chargées!"
            // Custom no data string.
            limit={20}
            // No of rows to display at a time
            // containerStyle={}
            // Customize table container style
            headerStyle={headerStyle}
            // // Customize table header style
            // rowStyle={}
            // // Customize table row style
            dataStyle={dataStyle}
            // Customize table data cell style
            showActions
            // Enable Row Operation
            // 'edit', 'delete',
            actionTypes={['view']}
            // Type of Row Operation (case insensitive)
            // enableMultiSelect
            // Enable Multi-select
            // defaultCheckedKey="selected"
            // Key present in data to mark row checked
            // disableCheckedKey="selectDisabled"
            // Key present in data to make row checkbox disabled
            // onRowSelect={(args, event, row) => {
            //     // 'row' returns row object
            //     // any arguments passed will be before 'event' and 'row'
            // }}
            // onAllRowSelect={(args, event, allrows) => {
            //     // 'allrows' returns JSON objects of all rows of table
            //     // any arguments passed will be before 'event' and 'allrows'
            // }}
            // onRowDelete={(args, event, row) => {
            //     // 'row' returns row object
            //     // any arguments passed will be before 'event' and 'row'
            // }}
            // onRowEdit={(args, event, row) => {
            //     // 'row' returns row object
            //     // any arguments passed will be before 'event' and 'row'
            // }}
            onRowView={(args: any, event: any, row: any) => {
                // 'row' returns row object
                // any arguments passed will be before 'event' and 'row'

                console.log('event: ', event);
                const data2dispatch = tab.get(event.id);
                if (data2dispatch) {
                    dispatch({ type: 'loadDataToState', value: data2dispatch });
                    dispatch({ type: 'setSelectedRenter', value: Number(event.row) + 2 });
                    dispatch({ type: 'setMenuSelected', value: 'form' });
                }
            }}
        />
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
            },
            info,
            dates,
            document,
            options,
            prices,
        },
    } = useContext(RenterContext);

    const [rawRenters, setRawRenters] = useState<Map<string, string[]>>();

    const SPREADSHEET_ID = '1he2PWi4NUP_5AuKYhXmLo2chy4lduqzP5XWgRHSnSH8'; // '1dKSCcTzZjuB3twn8C604Ibf8HPj5I0g7-4peFioNbEs';
    const SPREADSHEET_NAME = 'Sheet1';
    const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`;

    useEffect(() => {
        const SHEET_STARTING_POINT = 'A1'; // 1st col that defines fixed cols' names
        const SHEET_ENDING_POINT = 'U'; // Last col to consider in the spreadsheet

        const getLatestRenters = () => {
            console.log('connected? ', connected);

            gapi.client.sheets.spreadsheets.values
                .get({
                    spreadsheetId: SPREADSHEET_ID,
                    range: `${SPREADSHEET_NAME}!${SHEET_STARTING_POINT}:${SHEET_ENDING_POINT}`,
                })
                .then(
                    (response) => {
                        console.log('response: ', response);
                        dispatch({ type: 'setGSheetConnected', value: true });

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

                        dispatch({ type: 'setGSheetConnected', value: false });

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

        if (connected || action === 'updated') {
            getLatestRenters();
        }
    }, [action, dispatch, connected]);

    useEffect(() => {
        console.log('rawRenters: ', rawRenters?.size);

        // if (rawRenters && rawRenters.size > 0) {
        dispatch({ type: 'setNbRenters', value: rawRenters?.size || 0 });
        // }
    }, [dispatch, rawRenters]);

    type AllCardsIS = Info | Address | Contact | Dates | Prices | Options | Document;
    type AllCards = Info | Dates | Prices | Options | Document;

    useEffect(() => {
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

        if (action === 'save') {
            const data2Backup: Array<string> = parseAllCards();
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
                        dispatch({ type: 'setState', value: { action: 'updated', row } });

                        store.addNotification({
                            title: 'Location enregistrée',
                            message: 'La location est correctement enregistrée dans le fichier Excel',
                            type: 'success',
                            insert: 'top',
                            container: 'top-right',
                            animationIn: ['animate__animated', 'animate__fadeIn'],
                            animationOut: ['animate__animated', 'animate__fadeOut'],
                            dismiss: {
                                duration: 5000,
                                onScreen: true,
                            },
                        });
                    } else {
                        store.addNotification({
                            title: "Erreur dans l'enregistrement",
                            message: "La location n'a pas pu être correctement enregistrée dans le fichier Excel",
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
    }, [action, dates, dispatch, document, info, nextInsertionRow, options, prices, row]);

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
