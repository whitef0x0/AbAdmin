/*!
 * AB Admin
 * Copyright(c) 2016 Pavlović Dž Filip
 * MIT Licensed
 */

'use strict'

var path = require('path');
var fs = require('fs');
var createRouter = require('./router');
var stats = require('./stats');

module.exports = function(app, authMiddleware){
	createRouter(app, authMiddleware);
	app.use(stats);
};