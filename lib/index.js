'use strict';

var regexMapper = require('./regex');
// const { Mongo, Redis } = require('./dbs');

var _require = require('./object'),
    shallowClone = _require.shallowClone,
    deepClone = _require.deepClone;

var _require2 = require('./date'),
    timestampToTime = _require2.timestampToTime,
    dateFormat = _require2.dateFormat;

var _require3 = require('./type'),
    getPrototypeType = _require3.getPrototypeType,
    isNotEmpty = _require3.isNotEmpty;

var _require4 = require('./string/ChineseTransformation'),
    simplized = _require4.simplized,
    traditionalized = _require4.traditionalized;

var _require5 = require('./array'),
    getDistinctValuesOfArray = _require5.getDistinctValuesOfArray,
    getRepeatedValuesOfArray = _require5.getRepeatedValuesOfArray,
    removeItem = _require5.removeItem;

var _require6 = require('./string'),
    trim = _require6.trim,
    capitalize = _require6.capitalize,
    capitalizeEveryWord = _require6.capitalizeEveryWord,
    escapeRegExp = _require6.escapeRegExp,
    fromCamelCase = _require6.fromCamelCase,
    toCamelCase = _require6.toCamelCase,
    reverseString = _require6.reverseString;
// const { Error, Success, Warning, ErrorConsole, SuccessConsole, WarningConsole, InsertConsole } = require('./log/ChalkConsole');


var _require7 = require('./system'),
    flexible = _require7.flexible,
    SystemMess = _require7.SystemMess;
// const { C, HC } = require('./crawler');

module.exports = {
  // 日期相关
  timestampToTime: timestampToTime, dateFormat: dateFormat,
  // 字符相关
  simplized: simplized, traditionalized: traditionalized,
  trim: trim, capitalize: capitalize, capitalizeEveryWord: capitalizeEveryWord, escapeRegExp: escapeRegExp, fromCamelCase: fromCamelCase, toCamelCase: toCamelCase, reverseString: reverseString,
  // 数据库相关
  // Mongo, Redis,
  // 输入相关
  // Error, Success, Warning, ErrorConsole, SuccessConsole, WarningConsole, InsertConsole,
  // 正则相关
  regexMapper: regexMapper,
  // 类型相关
  getPrototypeType: getPrototypeType, isNotEmpty: isNotEmpty,
  // 数组相关
  getDistinctValuesOfArray: getDistinctValuesOfArray, getRepeatedValuesOfArray: getRepeatedValuesOfArray, removeItem: removeItem,
  // 对象相关
  shallowClone: shallowClone, deepClone: deepClone,
  // 样式
  // flexible,
  // 系统
  SystemMess: SystemMess
  // 爬虫相关
  // C, HC
};