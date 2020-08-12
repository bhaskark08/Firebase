sap.ui.define([
	"chat/Chat/controller/BaseController"
], function (Controller) {
	"use strict";

	return Controller.extend("chat.Chat.controller.Home", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf chat.Chat.view.Home
		 */
		onInit: function () {
			var oJSONModel = this.getOwnerComponent().getModel("Users");
			this.getView().setModel(oJSONModel);

		},
		fnMakeUserOnline: function (oEvent) {
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var suser = oStorage.get("CurrentUser");
			if (suser) {
				this.fnUpdateOnline(suser, false);
			}
			var sUer = oEvent.getSource().getValue();
			if (sUer) {
				this.getOwnerComponent().getModel("Users").setProperty("/CurrentUser", sUer);
				this._FromUser = sUer;
				this.fnUpdateOnline(sUer, true);
				//Set data into Storage
				oStorage.put("CurrentUser", sUer);
			}
		},

		fnCreateNewUser: function () {
			var oFireBaseModel = this.getOwnerComponent().getModel("firebase");
			var oDB = oFireBaseModel.getProperty("/database");
			var sUserId = this.byId("UserId").getValue();
			var sUserName = this.byId("UserName").getValue();
			var sEmailId = this.byId("MailId").getValue();
			oDB.ref('Users/' + sUserId).set({
				UserId: sUserId,
				UserName: sUserName,
				MailId: sEmailId,
				Online: false,
				UnreadMessages: 0
			});
			this.byId("MailId").setValue("");
			this.byId("UserName").setValue("");
			this.byId("UserId").setValue("");

		},
		fnNavChat: function () {
			var sUser = this.getOwnerComponent().getModel("Users").getProperty("/CurrentUser");
			if (!sUser) {
				alert("Please select Current User ID");
				return;
			}
			this.getOwnerComponent().getRouter().navTo("Chat");
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf chat.Chat.view.Home
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf chat.Chat.view.Home
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf chat.Chat.view.Home
		 */
		//	onExit: function() {
		//
		//	}

	});

});