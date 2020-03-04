import * as firebase from 'firebase/app';
import 'firebase/messaging';

const initializedFirebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDeHDHz5IN-HtFEeeUZfU0LJHPiBsQwqEk",
    authDomain: "tntt-notification.firebaseapp.com",
    databaseURL: "https://tntt-notification.firebaseio.com",
    projectId: "tntt-notification",
    storageBucket: "tntt-notification.appspot.com",
    messagingSenderId: "302307941760",
    appId: "1:302307941760:web:c64e77fcbfcd3c7e3bf565",
    measurementId: "G-6HPG7HS10Y"
})
let messaging;
if(firebase.messaging.isSupported()) {
  messaging = initializedFirebaseApp.messaging();
}
messaging.usePublicVapidKey("BIAigkeBLHepzKgdHyoHi440KaXBX-7aLgsM5oFs2jasmUcLppxdq_qJB0TKHiXMe5-IeFN0IWBAXB-fTGIcRgg");

export { messaging };