import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './components/serviceWorker';
import App from './App'

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register('firebase-messaging-sw.js')
    .then(registration => {
      console.log('Successfully!')
    })
    .catch(err => {
      console.log('Error: ', err)
    })
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
