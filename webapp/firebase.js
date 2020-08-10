sap.ui.define([
	"sap/ui/model/json/JSONModel",
], function (JSONModel) {
	"use strict";

	// Firebase-config retrieved from the Firebase-console
	var firebaseConfig = {
		apiKey: "AIzaSyDD5PtyIHui0VkqHsA8N3E_ZXmr9y5ZvQI",
		authDomain: "my-chat-firebase-2b62b.firebaseapp.com",
		databaseURL: "https://my-chat-firebase-2b62b.firebaseio.com",
		projectId: "my-chat-firebase-2b62b",
		storageBucket: "my-chat-firebase-2b62b.appspot.com",
		messagingSenderId: "174598233875",
		appId: "1:174598233875:web:f6d9dbbbd6e7033e1c84e6",
		measurementId: "G-3M5DC9P2X4"
	};

	return {
		initializeFirebase: function () {
			try {

				// Initialize Firebase with the Firebase-config
				firebase.initializeApp(firebaseConfig);

				// Create a Firestore reference
				var firestore = firebase.firestore();
				// Create a Authentication reference
				var fireAuth = firebase.auth();

				var collRefUsers = firestore.collection("Users");
				var collRefChat = firestore.collection("CHART");
				var messaging = firebase.messaging();
				// Firebase services object
				var oFirebase = {
					firestore: firestore,
					fireAuth: fireAuth,
					collRefUsers: collRefUsers,
					collRefChat: collRefChat,
					fcm: messaging,
					database: firebase.database()
				};

				/*	// Enable background messaging handler
					messaging.setBackgroundMessageHandler(function (payload) {
						console.log("Message received in background. ", payload);

						// Retrieve data from the notification
						var notification = JSON.parse(payload.data.notification);
						const notificationTitle = notification.title;
						const notificationOptions = {
							body: notification.body,
							icon: "/webapp/" + notification.icon
						};

						// Show the notification with the params
						return self.registration.showNotification(notificationTitle,
							notificationOptions);
					});*/
				// Create a Firebase model out of the oFirebase service object which contains all required Firebase services
				var fbModel = new JSONModel(oFirebase);

				// Return the Firebase Model
				return fbModel;
			} catch (e) {
				console.error(e);
			}
		}
	};
});