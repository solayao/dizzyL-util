/** 
 * @description 使用chalk插件对console.log输出内容上色 
 * @example key(输出的内容)
 */
const chalk = require('chalk');
const getLogger = require('./log4js');
const {getPrototypeType} = require('../type');
let logger = getLogger();

/**
 * @description 文字染色方法
 * @param {Function} Error 红色错误渲染
 * @param {Function} Success 绿色成功渲染
 * @param {Function} Warning 橙色警告渲染
 */
const Success = chalk.bold.green;
const Warning = chalk.keyword('orange');
const Error = chalk.bold.red;
const MessBg = chalk.black.bgWhite;

const defaultStyle = {
    title: '标题',
    pathName: __filename,
    message: '',
    titleChalk: Success,
    pathNameChalk: Warning
}

const defaultOpt = {
    title: '测试标题',
    pathName: __filename,
    message: '内容'
}

/**
 * @description 输入日志封装
 * @param {*} option
 * @default
 * {
        title: '标题',
        pathName: __filename,
        message: '',
        titleChalk: Success,
        pathNameChalk: Warning
    }
 * @returns
 */
const messStyle = (option = {}) => {
    const {title, pathName, message, titleChalk, pathNameChalk} = {...defaultStyle, ...option};
    let mess = ['Function', 'RegExp', 'Symbol'].includes(getPrototypeType(message)) ? message : MessBg(message);
    return `${titleChalk(`[ ${title} | ${pathNameChalk(pathName.split('\\').pop())} ]`)} - \n${mess}`;
}

/**
 * @description Warning输出封装
 * @param {*} title Warning的标题
 * @param {*} pathName Warning出自
 * @param {*} message Warning信息
 */
const WarningConsole = ({title, pathName, message} = defaultOpt) => {
    let opt = {
        title,
        pathName,
        message,
        titleChalk: Warning,
        pathNameChalk: Error
    }
    let mess = messStyle(opt);
    logger.warn(mess);
    opt = mess = null;
}

/**
 * @description 成功输出封装
 * @param {*} title Success的标题
 * @param {*} pathName Success出自
 * @param {*} message Success信息
 */
const SuccessConsole = ({title, pathName, message} = defaultOpt) => {
    let opt = {
        title,
        pathName,
        message,
        titleChalk: Success,
    }
    let mess = messStyle(opt);
    logger.info(mess);
    opt = mess = null;
}

/**
 * @description 失败输出封装
 * @param {*} title Error的标题
 * @param {*} pathName Error出自
 * @param {*} message Error信息
 */
const ErrorConsole = ({title, pathName, message} = defaultOpt) => {
    let opt = {
        title,
        pathName,
        message,
        titleChalk: Error,
    }
    let mess = messStyle(opt);
    logger.error(mess);
    opt = mess = null;
}

module.exports = {
    messStyle,
    Error,
    Success,
    Warning,
    WarningConsole,
    SuccessConsole,
    ErrorConsole,
};

