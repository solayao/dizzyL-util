'use strict';

/** 
 * @description 使用chalk插件对console.log输出内容上色 
 * @example key(输出的内容)
 */
var chalk = require('chalk');

var _require = require('./log4js'),
    logger = _require.logger,
    accessLogger = _require.accessLogger,
    insertLogger = _require.insertLogger;

/**
 * @description 文字染色方法
 * @param {Function} Error 红色错误渲染
 * @param {Function} Success 绿色成功渲染
 * @param {Function} Warning 橙色警告渲染
 */


var Error = chalk.bold.red;
var Success = chalk.bold.green;
var MessBg = chalk.black.bgWhite;
var Warning = chalk.keyword('orange');

var messStyle = function messStyle() {
    var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "title";
    var pathName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __filename;
    var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    var titleChalk = arguments[3];
    var pathNameChalk = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : Warning;
    var messageChalk = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : MessBg;

    return titleChalk('[ ' + title + ' | ' + pathNameChalk(pathName.split('\\').pop()) + ' ]') + ' -- ' + messageChalk(message);
};

/**
 * @description Warning输出封装
 * @param {*} title Warning的标题
 * @param {*} pathName Warning出自
 * @param {*} message Warning信息
 */
var WarningConsole = function WarningConsole(title, pathName, message) {
    var mess = messStyle(title, pathName, message, Warning, Error);
    if (process.env.NODE_ENV === 'production') {
        logger.warn(mess);
    } else {
        console.log(mess);
    }
};

/**
 * @description 成功输出封装
 * @param {*} title Success的标题
 * @param {*} pathName Success出自
 * @param {*} message Success信息
 */
var SuccessConsole = function SuccessConsole(title, pathName, message) {
    var mess = messStyle(title, pathName, message, Success);
    if (process.env.NODE_ENV === 'production') {
        logger.warn(mess);
    } else {
        console.log(mess);
    }
};

/**
 * @description 失败输出封装
 * @param {*} title Error的标题
 * @param {*} pathName Error出自
 * @param {*} message Error信息
 */
var ErrorConsole = function ErrorConsole(title, pathName) {
    var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    var mess = messStyle(title, pathName, message, Error);
    if (process.env.NODE_ENV === 'production') {
        accessLogger.error(mess);
    } else {
        console.log(mess);
    }
};

/**
 * @description 插入/更新数据到数据库的输出封装
 * @param {*} title 标题
 * @param {*} pathName 出自
 * @param {*} message 信息
 */
var InsertConsole = function InsertConsole(title, pathName) {
    var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    var mess = messStyle(title, pathName, message, Success);
    if (process.env.NODE_ENV === 'production') {
        insertLogger.info(mess);
    } else {
        console.log(mess);
    }
};

module.exports = {
    Error: Error,
    Success: Success,
    Warning: Warning,
    WarningConsole: WarningConsole,
    SuccessConsole: SuccessConsole,
    ErrorConsole: ErrorConsole,
    InsertConsole: InsertConsole
};