const regexMapper = require('./lib/regex');
const { Mongo, Redis } = require('./lib/dbs');
const { shallowClone, deepClone } = require('./lib/object');
const { timestampToTime, dateFormat } = require('./lib/date');
const { getPrototypeType, isNotEmpty } = require('./lib/type');
const { simplized, traditionalized } = require('./lib/string/ChineseTransformation');
const { getDistinctValuesOfArray, getRepeatedValuesOfArray, removeItem } = require('./lib/array');
const { trim, capitalize, capitalizeEveryWord, escapeRegExp, fromCamelCase, toCamelCase, reverseString } = require('./lib/string');
const { Error, Success, Warning, ErrorConsole, SuccessConsole, WarningConsole, InsertConsole } = require('./lib/log/ChalkConsole');
const { flexiable, SystemMess } = require('./system');

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
  flexiable,
  // 系统
  SystemMess
}
