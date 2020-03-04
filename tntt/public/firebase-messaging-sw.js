importScripts("https://www.gstatic.com/firebasejs/7.9.3/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.9.3/firebase-messaging.js");

firebase.initializeApp({
  // Project Settings => Add Firebase to your web app
  apiKey: "AIzaSyDeHDHz5IN-HtFEeeUZfU0LJHPiBsQwqEk",
  authDomain: "tntt-notification.firebaseapp.com",
  databaseURL: "https://tntt-notification.firebaseio.com",
  projectId: "tntt-notification",
  storageBucket: "tntt-notification.appspot.com",
  messagingSenderId: "302307941760",
  appId: "1:302307941760:web:c64e77fcbfcd3c7e3bf565",
  measurementId: "G-6HPG7HS10Y"
});
let messaging;
if(firebase.messaging.isSupported()) {
  messaging = firebase.messaging();
}
messaging.usePublicVapidKey("BIAigkeBLHepzKgdHyoHi440KaXBX-7aLgsM5oFs2jasmUcLppxdq_qJB0TKHiXMe5-IeFN0IWBAXB-fTGIcRgg");
messaging.setBackgroundMessageHandler(payload => {
  const title = payload.data.title;
  const options = {
    body: payload.data.body,
    timestamp: payload.data.timestamp,
    icon: payload.data.icon,
  };
  return self.registration.showNotification(title, options);
});