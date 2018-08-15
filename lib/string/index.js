/**
 * @description 清除字符串左右两侧的任意空格
 * @author Dizzy L
 * @param {String} str 待转换的String
 * @returns {String} 
 */
const trim = (str) => str.replace(/^\s+|\s+$/g, '');

/**
 * @description 将字符串的第一个字母大写
 * @author Dizzy L
 * @param {String} str 待转换的String
 * @returns {String} 
 */
const capitalize = ([first, ...rest]) => first.toUpperCase() + rest.join('');

/**
 * @description 将字符串中每个单词的首字母大写
 * @author Dizzy L
 * @param {String} str 待转换的String
 * @returns {String} 
 */
const capitalizeEveryWord = (str) => str.replace(/\b[a-z]/g, char => char.toUpperCase());

/**
 * @description 转义要在正则表达式中使用的字符串
 * @author Dizzy L
 * @param {String} str 待转换的String
 * @returns {String} 
 */
const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * @description 从驼峰表示法转换为字符串形式
 * @author Dizzy L
 * @param {String} str 待转换的String
 * @param {String} separator 间隔符号
 * @returns {String} 
 */
const fromCamelCase = (str, separator = "_") => str.replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2').replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2').toLowerCase();

/**
 * @description 字符串转换为驼峰模式
 * @author Dizzy L
 * @param {String} str 待转换的String
 * @returns {String} 
 */
const toCamelCase = str => str.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2, offset) => p2 ? p2.toUpperCase() : p1.toLowerCase());

/**
 * @description 反转字符串
 * @author Dizzy L
 * @param {String} str 待转换的String
 * @returns {String} 
 */
const reverseString = str => [...str].reverse().join('');


module.exports = {
    trim,
    capitalize,
    capitalizeEveryWord,
    escapeRegExp,
    fromCamelCase,
    toCamelCase,
    reverseString,
}