import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const providerToUse = new URLSearchParams(document.location.search).get("provider") || "prod";
ReactDOM.render(<App provider={providerToUse} />, document.getElementById('root'));
registerServiceWorker();
