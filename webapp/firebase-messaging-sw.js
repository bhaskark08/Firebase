// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/6.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.2.0/firebase-messaging.js');
var firebaseConfig = {
	apiKey: "AIzaSyDD5PtyIHui0VkqHsA8N3E_ZXmr9y5ZvQI",
	authDomain: "my-chat-firebase-2b62b.firebaseapp.com",
	databaseURL: "https://my-chat-firebase-2b62b.firebaseio.com",
	projectId: "my-chat-firebase-2b62b",
	storageBucket: "my-chat-firebase-2b62b.appspot.com",
	messagingSenderId: "174598233875",
	appId: "1:174598233875:web:f6d9dbbbd6e7033e1c84e6",
	//	measurementId: "G-3M5DC9P2X4"
};

firebase.initializeApp(firebaseConfig);

//FCM Reference
var messaging = firebase.messaging();