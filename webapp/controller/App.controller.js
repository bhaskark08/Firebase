sap.ui.define([
	"chat/Chat/controller/BaseController"
], function (Controller) {
	"use strict";

	return Controller.extend("chat.Chat.controller.App", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf chat.Chat.view.App
		 */
		onInit: function () {
				var oJSONModel = this.getOwnerComponent().getModel("Users");
				var that = this;
				$(window).bind('beforeunload', function (event) {
					var suser = oJSONModel.getProperty("/CurrentUser");
					if (suser) {
						that.fnUpdateOnline(suser, false);
					}
				});
				var suserExst = oJSONModel.getProperty("/CurrentUser");
				if (suserExst) {
					this.getOwnerComponent().getRouter().navTo("Chat");
				}
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf chat.Chat.view.App
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf chat.Chat.view.App
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf chat.Chat.view.App
		 */
		//	onExit: function() {
		//
		//	}

	});

});