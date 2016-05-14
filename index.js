/*!
 * AB Admin
 * Copyright(c) 2016 Pavlović Dž Filip
 * MIT Licensed
 */

'use strict'

var path = require('path');
var fs = require('fs');
var router = require('./router');
var stats = require('./stats');

module.exports = (app) => {
        app.use('/abadmin', router);
        app.use('*', stats);
};