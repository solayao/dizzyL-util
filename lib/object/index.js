'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('../type'),
    getPrototypeType = _require.getPrototypeType;

/**
 * @description 对象浅克隆
 * @author Dizzy L
 * @param {Object} obj 
 * @returns {Object} 浅克隆的对象 or 传入非Object的会返回{}
 */


var shallowClone = function shallowClone(obj) {
    return getPrototypeType(obj) === 'Object' ? _extends({}, obj) : {};
};

/**
 * @description 对象/数组深克隆
 * @author Dizzy L
 * @param {*} source 
 * @returns {*} 深克隆对象/source本身
 */
var deepClone = function deepClone(source) {
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

module.exports = {
    shallowClone: shallowClone,
    deepClone: deepClone
};