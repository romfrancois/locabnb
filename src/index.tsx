import React from 'react';
import ReactDOM from 'react-dom';

import ReactNotification from 'react-notifications-component';

import App from './App';

import './res/css/index.css';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';

ReactDOM.render(
    <React.StrictMode>
        <img
            id="background"
            src="https://images.unsplash.com/photo-1590123034471-762117155a0b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=3300&q=80"
            alt="background"
        />
        <ReactNotification />
        <App />
    </React.StrictMode>,
    document.getElementById('root'),
);
