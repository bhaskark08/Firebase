sap.ui.define([
	"chat/Chat/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("chat.Chat.controller.View1", {
		onInit: function () {
			var oJSONModel = this.getOwnerComponent().getModel("Users");
			this.getView().setModel(oJSONModel);

			// Initialize Firebase

			//	var firestore = firebase.firestore();
			// Create a Firestore reference
			//	oJSONModel.setProperty("/firestore", firestore);

		},
		fnNavBack: function () {
			this.getOwnerComponent().getRouter().navTo("Home");
		},
		fnStartChart: function (oEvent) {
			var oUserModel = this.getOwnerComponent().getModel("Users");
			var sPath = oEvent.getSource().getBindingContextPath();
			var OObj = oUserModel.getProperty(sPath);
			this.fnCreateDialog(OObj);
		},
		fnCreateDialog: function (oObj) {
			var sUser = this.getOwnerComponent().getModel("Users").getProperty("/CurrentUser");
			if (!sUser) {
				alert("Please select Current User ID");
				return;
			}
			this._FromUser = sUser;
			this._ToUser = oObj.UserId;
			if (this._FromUser === this._ToUser) {
				alert("Please Select another User");
				return;
			}

			var oIP = new sap.m.Input({
				value: "",
				submit: function () {
					if (oIP.getValue()) {
						this.fnChat(oIP.getValue());
						oIP.setValue("");
					}
				}.bind(this)
			});
			var oDialog = new sap.m.Dialog({
				title: " " + oObj.UserId + " " + oObj.UserName,
				content: new sap.m.VBox({
					items: [
						new sap.m.List({
							items: {
								path: "/Messages",
								template: new sap.m.StandardListItem({
									title: {
										parts: ['Message', 'MessageFrom'],
										formatter: function (Message, sMessageFrom) {
											if (sUser !== sMessageFrom) {
												return Message;
											}
											return "";
										}
									},
									info: {
										parts: ['Message', 'MessageFrom'],
										formatter: function (Message, sMessageFrom) {
											if (sUser !== sMessageFrom) {
												return "";
											}
											return Message;
										}
									},
									//	"From : {MessageFrom}",
									infoState: {
										path: 'MessageFrom',
										formatter: function (sMessageFrom) {
											if (sUser === sMessageFrom) {
												return sap.ui.core.ValueState.Warning;
											}
											return sap.ui.core.ValueState.Success;
										}
									}
								})
							}
						}),
						oIP
					]
				}),
				beforeOpen: this.fnLoadChart.bind(this),
				beginButton: new sap.m.Button({
					text: "Send",
					press: function () {
						var sMsg = oIP.getValue();
						if (sMsg) {
							this.fnChat(sMsg);
							oIP.setValue("");
						}
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: "Close",
					press: function () {
						oDialog.close();
						oDialog.destroy();
					}
				})
			});

			// to get access to the controller's model
			this.getView().addDependent(oDialog);
			oDialog.setModel(this.getOwnerComponent().getModel("Messages"));
			oDialog.open();
		},
		fnLoadChart: function () {
			var oFireBaseModel = this.getOwnerComponent().getModel("firebase");
			var oDB = oFireBaseModel.getProperty("/database");
			var oMsgModel = this.getOwnerComponent().getModel("Messages");
			oDB.ref('CHAT/' + this._FromUser).on('value', function (oEle) {
				var aMsg = [];
				var oObj = oEle.val();
				var oObjProc = oEle.val();
				for (var key3 in oObjProc) {
					if (key3 === this._FromUser) {
						oObj = oObjProc[key3];
					}
				}
				for (var key in oObj) {
					for (var key2 in oObj[key]) {
						var oUser = oObj[key][key2];
						if ((oUser.MessageFrom === this._FromUser || oUser.MessageFrom === this._ToUser) &&
							(oUser.MessageTo === this._FromUser || oUser.MessageTo === this._ToUser)) {
							aMsg.push(oUser);
						}
					}
				}
				aMsg.sort(function (a, b) {
					var dateA = new Date(a.dateTime),
						dateB = new Date(b.dateTime);
					return dateA - dateB;
				});
				oMsgModel.setProperty("/Messages", aMsg);
				oMsgModel.updateBindings(true);
			}.bind(this));
		},
		fnDelete: function (oEvent) {
			var oUserModel = this.getOwnerComponent().getModel("Users");
			var sPath = oEvent.getParameter("listItem").getBindingContextPath();
			var OObj = oUserModel.getProperty(sPath);
			var oFireBaseModel = this.getOwnerComponent().getModel("firebase");
			var oDB = oFireBaseModel.getProperty("/database");
			oDB.ref('Users/' + OObj.UserId).remove();
		},
		fnChat: function (sMessage) {
			var oFireBaseModel = this.getOwnerComponent().getModel("firebase");
			var oDB = oFireBaseModel.getProperty("/database");
			var sUserId = this._FromUser;
			var sToUser = this._ToUser;
			var today = new Date();
			var sDateAndTime = today.toUTCString();
			var dDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
			var sTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
			oDB.ref('CHAT/' + sUserId + "/" + dDate + "T" + sTime).push({
				MessageFrom: sUserId,
				MessageTo: sToUser,
				Message: sMessage,
				Time: sTime,
				Date: dDate,
				dateTime: sDateAndTime
			});
			oDB.ref('CHAT/' + sToUser + "/" + dDate + "T" + sTime).push({
				MessageFrom: sUserId,
				MessageTo: sToUser,
				Message: sMessage,
				Time: sTime,
				Date: dDate,
				dateTime: sDateAndTime
			});
		}
	});
});