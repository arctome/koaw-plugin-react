import React from 'react';
import ReactDOM from 'react-dom';

// import App components
import App from './app';

// compile App component in `#app` HTML element
ReactDOM.hydrate(<App serverProps={window.__INITIAL_DATA__} />, document.getElementById('app'));