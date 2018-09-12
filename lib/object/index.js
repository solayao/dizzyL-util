const { getPrototypeType } = require('../type');

/**
 * @description 对象浅克隆
 * @author Dizzy L
 * @param {Object} obj 
 * @returns {Object} 浅克隆的对象 or 传入非Object的会返回{}
 */
const shallowClone = (obj) => getPrototypeType(obj) === 'Object' ? {...obj} : {};

/**
 * @description 对象/数组深克隆
 * @author Dizzy L
 * @param {*} source 
 * @returns {*} 深克隆对象/source本身
 */
const deepClone = (source) => {
    let copy = {};
    if (source instanceof Array) {
        copy = [];
    } else if (source instanceof Function) {
      return source;
    } else if (source instanceof Object) {
        copy = {};
    } else {
      return source;
    }
    for (let i in source) {
        copy[i] = source[i] instanceof Object ? deepClone(source[i]) : source[i];
    }
    return copy;
}

module.exports = {
    shallowClone,
    deepClone
}
