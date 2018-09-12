'use strict';

var log4js = require('log4js');
var logConfig = require('./log4js.json');
log4js.configure(logConfig);
var logger = log4js.getLogger();
var accessLogger = log4js.getLogger('access');
var insertLogger = log4js.getLogger('insert');

module.exports = {
    logger: logger,
    accessLogger: accessLogger,
    insertLogger: insertLogger
};