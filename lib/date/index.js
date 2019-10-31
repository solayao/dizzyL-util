"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @description 时间戳->日期格式(yyyy-MM-dd hh:mm:ss)
 * @author Dizzy L
 * @param {any} timestamp
 * @returns {String} yyyy-MM-dd hh:mm:ss格式的日期
 */
var timestampToTime = exports.timestampToTime = function timestampToTime(timestamp) {
  var Y = void 0,
      M = void 0,
      D = void 0,
      h = void 0,
      m = void 0,
      s = void 0;
  var length = timestamp.toString().length;
  var date = new Date(length === 13 ? parseInt(timestamp, 10) : parseInt(timestamp, 10) * 1000);

  function lt10change(val) {
    return parseInt(val, 10) < 10 ? "0" + val : val;
  }
  Y = date.getFullYear();
  M = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  D = lt10change(date.getDate());
  h = lt10change(date.getHours());
  m = lt10change(date.getMinutes());
  s = lt10change(date.getSeconds());
  return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
};

/**
 * @description 将 Date 转化为指定格式的String
 * @author Dizzy L
 * @param {any} date Date()或日期格式的String
 * @param {any} fmt 转换成格式
 * @returns {String} 指定格式的日期String
 */
var dateFormat = exports.dateFormat = function dateFormat(date, fmt) {
  // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
  // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
  var _this = date instanceof Date ? date : new Date(date);
  var o = {
    "M+": _this.getMonth() + 1, //月份
    "d+": _this.getDate(), //日
    "h+": _this.getHours(), //小时
    "m+": _this.getMinutes(), //分
    "s+": _this.getSeconds(), //秒
    "q+": Math.floor((_this.getMonth() + 3) / 3), //季度
    S: _this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (_this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  }return fmt;
};