sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/base/Log"
], function (Controller, oLog) {
	"use strict";
	return Controller.extend("chat.Chat.controller.BaseController", {
		fnUpdateOnline: function (sUer, bOnline) {
			var oUserModel = this.getOwnerComponent().getModel("Users");
			var aUsers = oUserModel.getProperty("/Users") || [];
			for (var i = 0, iLength = aUsers.length; i < iLength; i++) {
				var oObj = aUsers[i];
				if (oObj.UserId === sUer) {
					firebase.database().ref('Users/' + sUer).set({
						UserId: oObj.UserId,
						UserName: oObj.UserName,
						MailId: oObj.MailId,
						Online: bOnline,
						UnreadMessages: 0
					});
					break;
				}
			}
		}
	});

});