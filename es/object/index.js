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

/**
 * @description 对象key的重命名
 * @author Dizzy L
 * @param {Object} source 对象
 * @param {Object} mapper 对应表
 * @param {Boolean} includeOther 是否包含不在对应表内的key&value
 * @returns {*} 重命名后的对象/source本身
 */
const allKeyRename = (source, mapper, includeOther = true) => getPrototypeType(source) === 'Object' && getPrototypeType(mapper) === 'Object' ?
    Object.keys(source).reduce((total, current)=>{
            if (mapper.hasOwnProperty(current)) {
              let key = mapper[current];
              total[key] = source[current];
            } else {
               includeOther && total[current] = source[current];
            }
            return total;
    }, {}) : source;

module.exports = {
    shallowClone,
    deepClone,
    allKeyRename
}
