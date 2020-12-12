import React, { useContext, useEffect, useState } from 'react';
import Table from 'react-table-lite';
import { RenterContext } from '../../App';

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

const mapRowData2JSONObject = (renter: Array<string>): tableDataType => {
    // console.log('mapRowData2JSONObject: ', renters);

    return {
        row: renter[0],
        id: renter[1],
        name: renter[2],
        surname: renter[3],
        city: renter[4],
        start: renter[12],
        end: renter[13],
        price: renter[14],
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
            limit={10}
            // No of rows to display at a time
            // containerStyle={react-table-lite-container}
            // Customize table container style
            // headerStyle={}
            // // Customize table header style
            // rowStyle={}
            // // Customize table row style
            // dataStyle={}
            // Customize table data cell style
            showActions
            // Enable Row Operation
            // 'edit', 'delete',
            actionTypes={['view']}
            // Type of Row Operation (case insensitive)
            // enableMultiSelect
            // Enable Multi-select
            defaultCheckedKey="selected"
            // Key present in data to mark row checked
            disableCheckedKey="selectDisabled"
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
            status: { connected, action, nextInsertionRow, row },
            info,
            dates,
            document,
            options,
            prices,
        },
    } = useContext(RenterContext);

    const [rawRenters, setRawRenters] = useState<Map<string, string[]>>();

    useEffect(() => {
        const SPREADSHEET_ID = '1he2PWi4NUP_5AuKYhXmLo2chy4lduqzP5XWgRHSnSH8'; // '1dKSCcTzZjuB3twn8C604Ibf8HPj5I0g7-4peFioNbEs';
        const SPREADSHEET_NAME = 'Sheet1';

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
                        const tab: Map<string, Array<string>> = new Map();

                        response.result.values?.shift();

                        response.result.values?.map((values, index) => {
                            const key = values[0];

                            const results = [`${index}`].concat(values);
                            console.log(`key: ${key} || value: ${results}`);
                            tab.set(key, results);
                        });

                        return setRawRenters(tab);
                    },
                    (response) => {
                        console.error(`Error: ${response.result.error.message}`);
                    },
                );
        };

        if (connected || action === 'updated') {
            getLatestRenters();
        }
    }, [action, connected]);

    useEffect(() => {
        console.log('rawRenters: ', rawRenters?.size);

        if (rawRenters && rawRenters.size > 0) {
            dispatch({ type: 'setNbRenters', value: rawRenters.size });
        }
    }, [dispatch, rawRenters]);

    useEffect(() => {
        const parseData = (card: any, data2Backup: Array<any>) => {
            Object.values(card).forEach((field) => {
                if (field && typeof field === 'object') {
                    Object.values(field)
                        .map((data) => data)
                        .forEach((data) => data2Backup.push(data));
                }
                if ((field && typeof field === 'string') || typeof field === 'number') {
                    data2Backup.push(field);
                }
            });

            return data2Backup;
        };

        if (action === 'save') {
            console.log('saving data to sheet');

            const data2Backup: Array<any> = ['someID'];

            parseData(info, data2Backup);
            parseData(dates, data2Backup);
            parseData(prices, data2Backup);
            parseData(options, data2Backup);
            parseData(document, data2Backup);

            console.log('data2Backup: ', data2Backup);

            const SPREADSHEET_ID = '1he2PWi4NUP_5AuKYhXmLo2chy4lduqzP5XWgRHSnSH8'; // '1dKSCcTzZjuB3twn8C604Ibf8HPj5I0g7-4peFioNbEs';
            const SPREADSHEET_NAME = 'Sheet1';

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
                        dispatch({ type: 'setState', value: { action: 'updated' } });
                    }
                });
        }
    }, [action, dates, dispatch, document, info, nextInsertionRow, options, prices, row]);

    return <>{rawRenters && <div>{UserData({ data: rawRenters, dispatch })}</div>}</>;
};

export default GoogleSheet;