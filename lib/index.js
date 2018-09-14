'use strict';

var regexMapper = require('./regex');

var _require = require('./dbs'),
    Mongo = _require.Mongo,
    Redis = _require.Redis;

var _require2 = require('./object'),
    shallowClone = _require2.shallowClone,
    deepClone = _require2.deepClone;

var _require3 = require('./date'),
    timestampToTime = _require3.timestampToTime,
    dateFormat = _require3.dateFormat;

var _require4 = require('./type'),
    getPrototypeType = _require4.getPrototypeType,
    isNotEmpty = _require4.isNotEmpty;

var _require5 = require('./string/ChineseTransformation'),
    simplized = _require5.simplized,
    traditionalized = _require5.traditionalized;

var _require6 = require('./array'),
    getDistinctValuesOfArray = _require6.getDistinctValuesOfArray,
    getRepeatedValuesOfArray = _require6.getRepeatedValuesOfArray,
    removeItem = _require6.removeItem;

var _require7 = require('./string'),
    trim = _require7.trim,
    capitalize = _require7.capitalize,
    capitalizeEveryWord = _require7.capitalizeEveryWord,
    escapeRegExp = _require7.escapeRegExp,
    fromCamelCase = _require7.fromCamelCase,
    toCamelCase = _require7.toCamelCase,
    reverseString = _require7.reverseString;

var _require8 = require('./log/ChalkConsole'),
    Error = _require8.Error,
    Success = _require8.Success,
    Warning = _require8.Warning,
    ErrorConsole = _require8.ErrorConsole,
    SuccessConsole = _require8.SuccessConsole,
    WarningConsole = _require8.WarningConsole,
    InsertConsole = _require8.InsertConsole;

var _require9 = require('./system'),
    flexible = _require9.flexible,
    SystemMess = _require9.SystemMess;

module.exports = {
  // 日期相关
  timestampToTime: timestampToTime, dateFormat: dateFormat,
  // 字符相关
  simplized: simplized, traditionalized: traditionalized,
  trim: trim, capitalize: capitalize, capitalizeEveryWord: capitalizeEveryWord, escapeRegExp: escapeRegExp, fromCamelCase: fromCamelCase, toCamelCase: toCamelCase, reverseString: reverseString,
  // 数据库相关
  Mongo: Mongo, Redis: Redis,
  // 输入相关
  Error: Error, Success: Success, Warning: Warning, ErrorConsole: ErrorConsole, SuccessConsole: SuccessConsole, WarningConsole: WarningConsole, InsertConsole: InsertConsole,
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
  // 系统, 建议前端通过详细路径调用
  SystemMess: SystemMess
};