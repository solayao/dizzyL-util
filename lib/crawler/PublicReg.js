"use strict";

var urlReg = /((https?|ftp|file)\:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/;
var imgReg = /(((https?|ftp|file)\:\/\/)?[-A-Za-z0-9+&@#/%?=~_|!:,.;\u4e00-\u9fa5\uFE30-\uFFA0]+[-A-Za-z0-9+&@#/%=~_|]?\.(jpg|jpeg|gif|bmp|bnp|png))/i;
var yyyyMMddReg = /(\d\d\d\d-\d\d-\d\d)/;
var aHrefReg = /href="([-A-Za-z0-9+&@#/%?=~_|!:,.;]+)"/;
var chinese = /[\u4e00-\u9fa5\uFE30-\uFFA0]+/;

module.exports = {
    urlReg: urlReg, // 匹配URL正则
    imgReg: imgReg, // 匹配图片正则
    yyyyMMddReg: yyyyMMddReg, // 匹配yyyy-MM-dd时间正则
    aHrefReg: aHrefReg, // 匹配a标签的href属性值正则
    chinese: chinese // 匹配中文及中文标点
};