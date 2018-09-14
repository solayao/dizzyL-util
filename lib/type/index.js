'use strict';

/**
 * @description 获取元素的根类型
 * @author Dizzy L
 * @param {*} val 
 * @returns {String} Number/String/Object/Array/Null/Undefined/Symbol/Boolean/Function/RegExp
 */
var getPrototypeType = function getPrototypeType(val) {
  return (/^\[object ([a-zA-Z]+)\]$/.test(Object.prototype.toString.call(val)) && RegExp.$1
  );
};

/**
 * @description 判断元素是否非空(Array, Object)，非0, 非undefined, 非null
 * @author Dizzy L
 * @param {*} val 
 * @returns {Boolean}
 */
var isNotEmpty = function isNotEmpty(val) {
  return !!val && (Array.isArray(val) ? val.length > 0 : true) && (getPrototypeType(val) === 'Object' ? Object.keys(val).length > 0 : true);
};

module.exports = {
  getPrototypeType: getPrototypeType,
  isNotEmpty: isNotEmpty
};