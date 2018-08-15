/** 
 * @description 使用chalk插件对console.log输出内容上色 
 * @example key(输出的内容)
 */
const chalk = require('chalk');
const { logger, accessLogger, insertLogger } = require('./log4js');

/**
 * @description 文字染色方法
 * @param {Function} Error 红色错误渲染
 * @param {Function} Success 绿色成功渲染
 * @param {Function} Warning 橙色警告渲染
 */
const Error = chalk.bold.red;
const Success = chalk.bold.green;
const MessBg = chalk.black.bgWhite;
const Warning = chalk.keyword('orange');

const messStyle = (title = "title", pathName = __filename, message = "", titleChalk, pathNameChalk = Warning, messageChalk = MessBg) => {
    return `${titleChalk(`[ ${title} | ${pathNameChalk(pathName.split('\\').pop())} ]`)} -- ${messageChalk(message)}`;
}

/**
 * @description Warning输出封装
 * @param {*} title Warning的标题
 * @param {*} pathName Warning出自
 * @param {*} message Warning信息
 */
const WarningConsole = (title, pathName, message) => {
    const mess = messStyle(title, pathName, message, Warning, Error);
    if(process.env.NODE_ENV === 'production') {
        logger.warn(mess);
    } else {
        console.log(mess);
    }
}

/**
 * @description 成功输出封装
 * @param {*} title Success的标题
 * @param {*} pathName Success出自
 * @param {*} message Success信息
 */
const SuccessConsole = (title, pathName, message) => {
    const mess = messStyle(title, pathName, message, Success);
    if(process.env.NODE_ENV === 'production') {
        logger.warn(mess);
    } else {
        console.log(mess);
    }
}

/**
 * @description 失败输出封装
 * @param {*} title Error的标题
 * @param {*} pathName Error出自
 * @param {*} message Error信息
 */
const ErrorConsole = (title, pathName, message = '') => {
    const mess = messStyle(title, pathName, message, Error);
    if(process.env.NODE_ENV === 'production') {
        accessLogger.error(mess);
    } else {
        console.log(mess);
    }
}

/**
 * @description 插入/更新数据到数据库的输出封装
 * @param {*} title 标题
 * @param {*} pathName 出自
 * @param {*} message 信息
 */
const InsertConsole = (title, pathName, message = '') => {
    const mess = messStyle(title, pathName, message, Success);
    if(process.env.NODE_ENV === 'production') {
        insertLogger.info(mess);
    } else {
        console.log(mess);
    }
}

module.exports = {
    Error,
    Success,
    Warning,
    WarningConsole,
    SuccessConsole,
    ErrorConsole,
    InsertConsole
};