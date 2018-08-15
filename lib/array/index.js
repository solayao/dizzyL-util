/**
 * @description 数组去重
 * @author Dizzy L
 * @param {Array} arr 
 * @returns {Array} 去重后的数组
 */
const getDistinctValuesOfArray = arr => Array.from(new Set(arr));

/**
 * @description 获取数组中重复的元素
 * @author Dizzy L
 * @param {Array} arr 
 * @returns {Array} 重复元素组成的数组
 */
const getRepeatedValuesOfArray = arr => {
    const s = new Set(arr);
    s.forEach(v => delete arr[arr.findIndex(aV => aV === v)]);
    return arr.filter(v => v);
}

/**
 * @description 获取移除某项后的数组
 * @author Dizzy L
 * @param {Array} arr 
 * @param {Number} index
 * @returns {Array} arr
 */
const removeItem = (arr, index) => {
    arr.splice(index, 1);
    return arr;
}

module.exports = {
    getDistinctValuesOfArray,
    getRepeatedValuesOfArray,
    removeItem
}