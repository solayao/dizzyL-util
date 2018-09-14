'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

/**
 * @description 清除字符串左右两侧的任意空格
 * @author Dizzy L
 * @param {String} str 待转换的String
 * @returns {String} 
 */
var trim = function trim(str) {
  return str.replace(/^\s+|\s+$/g, '');
};

/**
 * @description 将字符串的第一个字母大写
 * @author Dizzy L
 * @param {String} str 待转换的String
 * @returns {String} 
 */
var capitalize = function capitalize(_ref) {
  var _ref2 = _toArray(_ref),
      first = _ref2[0],
      rest = _ref2.slice(1);

  return first.toUpperCase() + rest.join('');
};

/**
 * @description 将字符串中每个单词的首字母大写
 * @author Dizzy L
 * @param {String} str 待转换的String
 * @returns {String} 
 */
var capitalizeEveryWord = function capitalizeEveryWord(str) {
  return str.replace(/\b[a-z]/g, function (char) {
    return char.toUpperCase();
  });
};

/**
 * @description 转义要在正则表达式中使用的字符串
 * @author Dizzy L
 * @param {String} str 待转换的String
 * @returns {String} 
 */
var escapeRegExp = function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * @description 从驼峰表示法转换为字符串形式
 * @author Dizzy L
 * @param {String} str 待转换的String
 * @param {String} separator 间隔符号
 * @returns {String} 
 */
var fromCamelCase = function fromCamelCase(str) {
  var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "_";
  return str.replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2').replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2').toLowerCase();
};

/**
 * @description 字符串转换为驼峰模式
 * @author Dizzy L
 * @param {String} str 待转换的String
 * @returns {String} 
 */
var toCamelCase = function toCamelCase(str) {
  return str.replace(/^([A-Z])|[\s-_]+(\w)/g, function (match, p1, p2, offset) {
    return p2 ? p2.toUpperCase() : p1.toLowerCase();
  });
};

/**
 * @description 反转字符串
 * @author Dizzy L
 * @param {String} str 待转换的String
 * @returns {String} 
 */
var reverseString = function reverseString(str) {
  return [].concat(_toConsumableArray(str)).reverse().join('');
};

module.exports = {
  trim: trim,
  capitalize: capitalize,
  capitalizeEveryWord: capitalizeEveryWord,
  escapeRegExp: escapeRegExp,
  fromCamelCase: fromCamelCase,
  toCamelCase: toCamelCase,
  reverseString: reverseString
};