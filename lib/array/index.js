"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @description 数组去重
 * @author Dizzy L
 * @param {Array} arr
 * @returns {Array} 去重后的数组
 */
var getDistinctValuesOfArray = exports.getDistinctValuesOfArray = function getDistinctValuesOfArray(arr) {
  return Array.from(new Set(arr));
};

/**
 * @description 获取数组中重复的元素
 * @author Dizzy L
 * @param {Array} arr
 * @returns {Array} 重复元素组成的数组
 */
var getRepeatedValuesOfArray = exports.getRepeatedValuesOfArray = function getRepeatedValuesOfArray(arr) {
  var s = new Set(arr);
  s.forEach(function (v) {
    return delete arr[arr.findIndex(function (aV) {
      return aV === v;
    })];
  });
  return arr.filter(function (v) {
    return v;
  });
};

/**
 * @description 获取移除某项后的数组
 * @author Dizzy L
 * @param {Array} arr
 * @param {Number} index
 * @returns {Array} arr
 */
var removeItem = exports.removeItem = function removeItem(arr, index) {
  arr.splice(index, 1);
  return arr;
};