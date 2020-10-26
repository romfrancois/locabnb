exports.handler = () => {
    const response = {
        API_KEY: process.env.LOCABNB_API_KEY,
        CLIENT_ID: process.env.LOCABNB_CLIENT_ID,
    };

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(response),
    };
};
