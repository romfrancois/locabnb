import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useState } from 'react';

import { store } from 'react-notifications-component';

import { RenterContext } from '../../App';

const initClient = (options: { globalOptions: any; updateLoggedInStatus: (status: boolean) => void }) => {
    gapi.client
        .init(options.globalOptions)
        .then(() => {
            // Listen for sign-in state changes.
            // console.log('gapi.auth2', gapi.auth2);
            gapi.auth2.getAuthInstance().isSignedIn.listen(options.updateLoggedInStatus);

            // Handle the initial sign-in state.
            options.updateLoggedInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        })
        .catch((err: any) => {
            console.error('Caught error', err);

            store.addNotification({
                title: 'Erreur',
                message: 'Erreur en se connectant au compte Google',
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
        });
};

function LogInOutButton(options: { loggedIn: boolean; logIn: () => void; logOut: () => void }): JSX.Element {
    const { loggedIn, logIn, logOut } = options;
    const buttonText = loggedIn ? 'Déconnecter' : 'Connecter';
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

    const {
        state: {
            status: {
                googleState: { connected },
            },
        },
    } = useContext(RenterContext);

    const [loggedInStatus, setLoggedInStatus] = useState<boolean>(false);

    const [globalOptions, setGlobalOptions] = useState({});

    useEffect(() => {
        if (connected) {
            store.addNotification({
                title: 'Connecté',
                message: 'Vous êtes maintenant connecté à votre compte Google',
                type: 'success',
                insert: 'top',
                container: 'top-right',
                animationIn: ['animate__animated', 'animate__fadeIn'],
                animationOut: ['animate__animated', 'animate__fadeOut'],
                dismiss: {
                    duration: 3000,
                    onScreen: true,
                },
            });
        } else {
            store.addNotification({
                title: 'Déconnecté',
                message: "Vous n'êtes plus connecté à votre compte Google",
                type: 'warning',
                insert: 'top',
                container: 'top-right',
                animationIn: ['animate__animated', 'animate__fadeIn'],
                animationOut: ['animate__animated', 'animate__fadeOut'],
                dismiss: {
                    duration: 4000,
                    onScreen: true,
                },
            });
        }
    }, [connected]);

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

                store.addNotification({
                    title: 'Erreur',
                    message: 'Problème avec les paramètres de connexion',
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
                        dispatch({ type: 'setGoogleConnected', value: status });
                    },
                });
            }
        });
    }, [dispatch, globalOptions]);

    return (
        <LogInOutButton
            loggedIn={loggedInStatus}
            logIn={() => gapi.auth2.getAuthInstance().signIn()}
            logOut={() => gapi.auth2.getAuthInstance().signOut()}
        />
    );
};

export default GoogleConnection;
