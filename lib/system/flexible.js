"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @description 淘宝的rem精简版, 适用web app
 * @author Dizzy L
 * @param {Number} dWidth 设计稿宽度
 * @param {Number} maxWidth 设计稿最大宽度
 * @param {Number} remScale 设计稿配置html的font-size值，Rem比例（控件宽高/remScale = 要在css设置：? rem）
 */
var flexible = exports.flexible = function flexible() {
  var dWidth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 750;
  var mWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 750;
  var remScale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;

  (function (designWidth, maxWidth, remScale) {
    var doc = document,
        win = window;
    var docEl = doc.documentElement;
    var metaEl, metaElCon;
    var remStyle = document.createElement("style");
    var wrap;
    var tid;

    function refreshRem() {
      var width = docEl.getBoundingClientRect().width;
      if (!maxWidth) {
        maxWidth = 540;
      }
      if (width > maxWidth) {
        // 只兼容小于maxWidth的移动端设备
        width = maxWidth;
      }
      if (width < 320) {
        width = 320;
      }
      var rem = width * remScale / designWidth; // 其实是：width/(designWidth/rem基准)
      // var rem = width / 10; // 如果要兼容vw的话分成10份 淘宝做法
      remStyle.innerHTML = "html{font-size:" + rem + "px;}";
    }

    // 设置 viewport ，有的话修改 没有的话设置
    metaEl = doc.querySelector('meta[name="viewport"]');
    // 20171219修改：增加 viewport-fit=cover ，用于适配iphoneX
    metaElCon = "width=device-width,initial-scale=1,maximum-scale=1.0,user-scalable=no,viewport-fit=cover";
    if (metaEl) {
      metaEl.setAttribute("content", metaElCon);
    } else {
      metaEl = doc.createElement("meta");
      metaEl.setAttribute("name", "viewport");
      metaEl.setAttribute("content", metaElCon);
      if (docEl.firstElementChild) {
        docEl.firstElementChild.appendChild(metaEl);
      } else {
        wrap = doc.createElement("div");
        wrap.appendChild(metaEl);
        doc.write(wrap.innerHTML);
        wrap = null;
      }
    }

    //要等 viewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
    refreshRem();

    if (docEl.firstElementChild) {
      docEl.firstElementChild.appendChild(remStyle);
    } else {
      wrap = doc.createElement("div");
      wrap.appendChild(remStyle);
      doc.write(wrap.innerHTML);
      wrap = null;
    }

    win.addEventListener("resize", function () {
      clearTimeout(tid); //防止执行两次
      tid = setTimeout(refreshRem, 300);
    }, false);

    win.addEventListener("pageshow", function (e) {
      if (e.persisted) {
        // 浏览器后退的时候重新计算
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
      }
    }, false);

    if (doc.readyState === "complete") {
      doc.body.style.fontSize = "16px";
    } else {
      doc.addEventListener("DOMContentLoaded", function (e) {
        doc.body.style.fontSize = "16px";
      }, false);
    }
  })(dWidth, mWidth, remScale);
};