"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allKeyRename = exports.deepClone = exports.shallowClone = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _type = require("../type");

/**
 * @description 对象浅克隆
 * @author Dizzy L
 * @param {Object} obj
 * @returns {Object} 浅克隆的对象 or 传入非Object的会返回{}
 */
var shallowClone = exports.shallowClone = function shallowClone(obj) {
  return (0, _type.getPrototypeType)(obj) === "Object" ? _extends({}, obj) : {};
};

/**
 * @description 对象/数组深克隆
 * @author Dizzy L
 * @param {*} source
 * @returns {*} 深克隆对象/source本身
 */
var deepClone = exports.deepClone = function deepClone(source) {
  var copy = {};
  if (source instanceof Array) {
    copy = [];
  } else if (source instanceof Function) {
    return source;
  } else if (source instanceof Object) {
    copy = {};
  } else {
    return source;
  }
  for (var i in source) {
    copy[i] = source[i] instanceof Object ? deepClone(source[i]) : source[i];
  }
  return copy;
};

/**
 * @description 对象key的重命名
 * @author Dizzy L
 * @param {Object} source 对象
 * @param {Object} mapper 对应表
 * @param {Boolean} includeOther 是否包含不在对应表内的key&value
 * @returns {*} 重命名后的对象/source本身
 */
var allKeyRename = exports.allKeyRename = function allKeyRename(source, mapper) {
  var includeOther = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return (0, _type.getPrototypeType)(source) === "Object" && (0, _type.getPrototypeType)(mapper) === "Object" ? Object.keys(source).reduce(function (total, current) {
    if (mapper.hasOwnProperty(current)) {
      var key = mapper[current];
      total[key] = source[current];
    } else if (includeOther) {
      total[current] = source[current];
    }
    return total;
  }, {}) : source;
};