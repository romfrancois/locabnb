import React from 'react';
import ReactDOM from 'react-dom';

import ReactNotification from 'react-notifications-component';

import App from './App';

import './res/css/index.css';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';

ReactDOM.render(
    <React.StrictMode>
        <ReactNotification />
        <App />
    </React.StrictMode>,
    document.getElementById('root'),
);
