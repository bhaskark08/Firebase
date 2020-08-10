/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"chat/Chat/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});