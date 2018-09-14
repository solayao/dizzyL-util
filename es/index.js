const regexMapper = require('./regex');
const { Mongo, Redis } = require('./dbs');
const { shallowClone, deepClone } = require('./object');
const { timestampToTime, dateFormat } = require('./date');
const { getPrototypeType, isNotEmpty } = require('./type');
const { simplized, traditionalized } = require('./string/ChineseTransformation');
const { getDistinctValuesOfArray, getRepeatedValuesOfArray, removeItem } = require('./array');
const { trim, capitalize, capitalizeEveryWord, escapeRegExp, fromCamelCase, toCamelCase, reverseString } = require('./string');
const { Error, Success, Warning, ErrorConsole, SuccessConsole, WarningConsole, InsertConsole } = require('./log/ChalkConsole');
const { flexible, SystemMess } = require('./system');

module.exports = {
  // 日期相关
  timestampToTime, dateFormat,
  // 字符相关
  simplized, traditionalized,
  trim, capitalize, capitalizeEveryWord, escapeRegExp, fromCamelCase, toCamelCase, reverseString,
  // 数据库相关
  Mongo, Redis,
  // 输入相关
  Error, Success, Warning, ErrorConsole, SuccessConsole, WarningConsole, InsertConsole,
  // 正则相关
  regexMapper,
  // 类型相关
  getPrototypeType, isNotEmpty,
  // 数组相关
  getDistinctValuesOfArray, getRepeatedValuesOfArray, removeItem,
  // 对象相关
  shallowClone, deepClone,
  // 样式
  // flexible,
  // 系统, 建议前端通过详细路径调用
  SystemMess
}
