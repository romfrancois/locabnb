exports.handler = () => {
    const response = {
        apiKey: process.env.LOCABNB_GOOGLE_API_KEY,
        clientId: process.env.LOCABNB_GOOGLE_CLIENT_ID,
        discoveryDocs: [
            'https://sheets.googleapis.com/$discovery/rest?version=v4',
            'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
        ],
        scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/calendar',
    };

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(response),
    };
};
