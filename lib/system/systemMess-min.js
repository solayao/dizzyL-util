"use strict";var _createClass=function(){function e(e,s){for(var n=0;n<s.length;n++){var i=s[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(s,n,i){return n&&e(s.prototype,n),i&&e(s,i),s}}();function _classCallCheck(e,s){if(!(e instanceof s))throw new TypeError("Cannot call a class as a function")}var _engine={ie:0,gecko:0,webkit:0,khtml:0,opera:0,ver:null},_browser={ie:0,firefox:0,safari:0,konq:0,opera:0,chrome:0,ver:null},_system={win:!1,mac:!1,x11:!1,iphone:!1,ipod:!1,ipad:!1,ios:!1,android:!1,nokiaN:!1,winMobile:!1,wii:!1,ps:!1},_instance=void 0,SystemMess=function(){function e(){if(_classCallCheck(this,e),!_instance&&(_instance=this,navigator)){var s=navigator.userAgent;if(window.opera)_engine.ver=_browser.ver=window.opear.version(),_engine.opera=_browser.opera=parseFloat(_engine.ver);else if(/AppleWebKit\/(\S+)/.test(s))if(_engine.ver=RegExp.$1,_engine.webkit=parseFloat(_engine.ver),/Chrome\/(\S+)/.test(s))_browser.ver=RegExp.$1,_browser.chrome=parseFloat(_browser.ver);else if(/Version\/(\S+)/.test(s))_browser.ver=RegExp.$1,_browser.safari=parseFloat(_browser.ver);else{var n=1;n=_engine.webkit<100?1:_engine.webkit<312?1.2:_engine.webkit<412?1.3:2,_browser.safari=_browser.ver=n}else/(KHTML\/(\S+)) | (Konqueror\/([^;]+))/.test(s)?(_engine.ver=_browser.ver=RegExp.$1,_engine.khtml=_browser.konq=parseFloat(_engine.ver)):/rv:([^\)]+)\) Gecko\/\d{8}/.test(s)?(_engine.ver=RegExp.$1,_engine.gecko=parseFloat(_engine.ver),/Firefox\/(\S+)/.test(s)&&(_browser.ver=RegExp.$1,_browser.firefox=parseFloat(_browser.ver))):/MSIE ([^;]+)/.test(s)&&(_engine.ver=_browser.ver=RegExp.$1,_engine.ie=_browser.ie=parseFloat(_engine.ver));_browser.ie=_engine.ie,_browser.opera=_engine.opera;var i=navigator.platform;if(_system.win=0===i.indexOf("Win"),_system.mac=0===i.indexOf("Mac"),_system.x11="X11"===i||0===i.indexOf("Linux"),_system.win&&/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(s))if("NT"===RegExp.$1)switch(RegExp.$2){case"5.0":_system.win="2000";break;case"5.1":_system.win="XP";break;case"6.0":_system.win="Vista";break;case"6.1":_system.win="7";break;default:_system.win="NT"}else"9x"===RegExp.$1?_system.win="ME":_system.win=RegExp.$1;_system.iphone=s.indexOf("iPhone")>-1,_system.ipod=s.indexOf("iPod")>-1,_system.ipad=s.indexOf("iPad")>-1,_system.nokiaN=s.indexOf("NokiaN")>-1,"CE"===_system.win?_system.winMobile=_system.win:"Ph"===_system.win&&/Windows Phone OS (\d+.\d+)/.test(s)&&(_system.win="Phone",_system.winMobile=parseFloat(RegExp.$1)),_system.mac&&s.indexOf("Mobile")>-1&&(/CPU (?:iPhone )?OS (\d+_\d+)/.test(s)?_system.ios=parseFloat(RegExp.$1.replace("_",".")):_system.ios=2),/Android (\d+\.\d+)/.test(s)&&(_system.android=parseFloat(RegExp.$1)),_system.wii=s.indexOf("Wii")>-1,_system.ps=/playstation/i.test(s)}return _instance}return _createClass(e,[{key:"getSystemMess",get:function(){return{engine:_engine,browser:_browser,system:_system}}},{key:"isPhone",get:function(){var e=Object.keys(_system).filter(function(e){return Boolean(_system[e])});return["iphone","ipod","ipad","ios","android","nokiaN","winMobile"].some(function(s){return e.includes(s)})}}]),e}();module.exports=SystemMess;