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
            src="https://images.unsplash.com/photo-1586446911746-3038e9751ac9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
            alt="background"
        />
        <ReactNotification />
        <App />
    </React.StrictMode>,
    document.getElementById('root'),
);
