import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useState } from 'react';
import { RenterContext } from '../../App';

const initClient = (options: { globalOptions: any; updateLoggedInStatus: (status: boolean) => void }) => {
    gapi.client
        .init(options.globalOptions)
        .then(() => {
            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(options.updateLoggedInStatus);

            // Handle the initial sign-in state.
            options.updateLoggedInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        })
        .catch((err: any) => {
            console.error('Caught error', err);
        });
};

function LogInOutButton(options: { loggedIn: boolean; logIn: () => void; logOut: () => void }): JSX.Element {
    const { loggedIn, logIn, logOut } = options;
    const buttonText = loggedIn ? 'Log out' : 'Log in';
    const buttonAction = loggedIn ? logOut : logIn;

    const icon = loggedIn ? faSignOutAlt : faSignInAlt;

    return (
        <button type="button" onClick={buttonAction}>
            <FontAwesomeIcon className="faStyle fa-3x" icon={icon} />
            <span>{buttonText}</span>
        </button>
    );
}

const GoogleConnection = (): JSX.Element => {
    console.log('Google');

    const { dispatch } = useContext(RenterContext);

    const [loggedInStatus, setLoggedInStatus] = useState<boolean>(false);
    // const [initiatedClient, setInitiatedClient] = useState<boolean>(false);

    const [globalOptions, setGlobalOptions] = useState({});

    useEffect(() => {
        const retrieveGoogleParam = async (url: string) => {
            const response = await fetch(url);

            try {
                const param = await response.json();
                if (param) {
                    const sizeOfOptions = Object.keys(param).length;

                    if (sizeOfOptions > 0) {
                        setGlobalOptions(param);
                    }
                }
            } catch (err) {
                console.log('Error while retrieving options!');
            }
        };

        const credentialsURL = `/.netlify/functions/globalOptions`;
        retrieveGoogleParam(credentialsURL);
    }, []);

    useEffect(() => {
        gapi.load('client:auth2', () => {
            const sizeOfOptions = Object.keys(globalOptions).length;
            if (sizeOfOptions > 0) {
                initClient({
                    globalOptions,
                    updateLoggedInStatus: (status) => {
                        // console.log('Login status', status);
                        setLoggedInStatus(status);
                        dispatch({ type: 'setConnected', value: status });
                    },
                });
            }
        });

        // setInitiatedClient(true);
    }, [dispatch, globalOptions /* initiatedClient, */ /* loggedInStatus */]);

    return (
        <LogInOutButton
            loggedIn={loggedInStatus}
            logIn={() => gapi.auth2.getAuthInstance().signIn()}
            logOut={() => gapi.auth2.getAuthInstance().signOut()}
        />
    );
};

export default GoogleConnection;
