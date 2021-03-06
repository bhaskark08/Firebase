sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"chat/Chat/model/models",
	"sap/ui/model/json/JSONModel",
	"chat/Chat/firebase",
	"chat/Chat/model/firebaseDB",
	"chat/Chat/model/firebase-messaging",
	"sap/m/MessageBox"
], function (UIComponent, Device, models, JSONModel, Firebase, firebaseDB, Fmessaging, MessageBox) {
	"use strict";

	return UIComponent.extend("chat.Chat.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			// Import Firebase in the sap.ui.define
			// set the firebase model by calling the initializeFirebase function in the Firebase.js file
			this.setModel(Firebase.initializeFirebase(), "firebase");
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			//Get data from Storage
			var suser = oStorage.get("CurrentUser");
			if (suser) {
				//Set data into Storage
				oStorage.put("CurrentUser", suser);
			} else {
				suser = "";
			}

			this.setModel(new JSONModel({
				Users: [],
				CurrentUser: suser
			}), "Users");

			this.getModel("Users").setSizeLimit(20000);
			this.setModel(new JSONModel({
				Messages: []
			}), "Messages");

			// Create a Fireauth reference
			var fireAuth = this.getModel("firebase").getProperty("/fireAuth");

			// Login the user anonymously
			fireAuth.signInAnonymously().catch(function (error) {
				// Handle Errors here.
				MessageBox.error(error.code);
				MessageBox.error(error.message);
			});

			firebase.auth().onAuthStateChanged(function (user) {
				if (user) {
					// User is signed in.
					var isAnonymous = user.isAnonymous;
					var uid = user.uid;
					console.log("User: ", user);

					this.getUserData();

					/*// CLOUD MESSAGING FCM
					// Since we are logged in now we will ask the user permission to send notifications
					// Create a FCM reference
					var messaging = this.getModel("firebase").getProperty("/fcm");

					// Add the public key generated from the console here.
					messaging.usePublicVapidKey("BHuyfhMqbXzEqOQk3EnDczjizQRQZ2zhjiah1ktNNS7thx7c3V5s-Mwi9O5yGOUnbrbhByJx6YIJ0_QCa_qmJqc");
					//FCM ask permission

					messaging.requestPermission().then(function () {
						return messaging.getToken();
					}).then(function (token) {
						//	alert(token);
					}).catch(function (err) {
						//	alert(err);
					});
					// Show message in foreground (if desired)
					messaging.onMessage(function (payload) {
						alert("Message received. ", payload);
						var notification = JSON.parse(payload.data.notification);
						var notificationTitle = notification.title;
						var notificationOptions = {
							body: notification.body,
							icon: notification.icon,
						};
						var notification = new Notification(notificationTitle, notificationOptions);
						return notification;
					});*/
				} else {
					// User is signed out.
				}
			}.bind(this));

		},
		getUserData: function () {
			var oFireBaseModel = this.getModel("firebase");
			var oFire = oFireBaseModel.getProperty("/firebase");
			var oFireStore = oFireBaseModel.getProperty("/firestore");
			var collRefUsers = oFireBaseModel.getProperty("/collRefUsers");
			try {
				var oUserModel = this.getModel("Users");
				var oDB = oFireBaseModel.getProperty("/database");
				var sUer = oUserModel.getProperty("/CurrentUser");
				var bInitialLoad = true;
				oDB.ref('Users').on('value', function (oEle) {
					var aUsers = [];
					var oObj = oEle.val();
					for (var key in oObj) {
						//	for (var key2 in oObj[key]) {
						//	var oUsr = oObj[key][key2];
						var oUsr = oObj[key];
						oUsr["OnlineText"] = (oUsr["Online"] ? "Online" : "Offline");
						aUsers.push(oUsr);
						//	}
					}
					oUserModel.setProperty("/Users", aUsers);
					if (sUer && bInitialLoad) {
						bInitialLoad = false;
						for (var i = 0, iLength = aUsers.length; i < iLength; i++) {
							var oObjUser = aUsers[i];
							if (oObjUser.UserId === sUer) {
								oDB.ref('Users/' + sUer).set({
									UserId: oObjUser.UserId,
									UserName: oObjUser.UserName,
									MailId: oObjUser.MailId,
									Online: true,
									UnreadMessages: 0
								});
								break;
							}
						}
					}

				});
				/*	collRefUsers.get().then(
						function (collection) {
							var aUsers = collection.docs.map(function (ouser) {
								return ouser.data();
							});
							oUserModel.setProperty("/Users", aUsers);

						}.bind(this));*/

				/*collRefUsers.onSnapshot(function (snapshot) {
					var aUsers = oUserModel.getProperty("/Users");
					// Get the shipment model

					// Get the current added/modified/removed document (shipment) 
					// of the collection (shipments)
					snapshot.docChanges().forEach(function (change) {
						// set id (to know which document is modifed and
						// replace it on change.Type == modified) 
						// and data of firebase document
						var oUser = change.doc.data();

						// Added document (shipment) add to arrat
						if (change.type === "added") {
							aUsers.push(oUser);
						}
						// Modified document (find its index and change current doc 
						// with the updated version)
						else if (change.type === "modified") {
							var index = aUsers.map(function (oUse) {
								return oUse.UserId;
							}).indexOf(oUser.UserId);
							aUsers[index] = oUser;
						}
						// Removed document (find index and remove it from the shipments array)
						else if (change.type === "removed") {
							var index = aUsers.map(function (oUse) {
								return oUse.UserId;
							}).indexOf(oUser.UserId);
							aUsers.splice(index, 1);
						}
					});
					
						oUserModel.setProperty("/Users", aUsers);
					

			});	*/

			} catch (e) {
				console.error(e);
			}
		}
	});
});