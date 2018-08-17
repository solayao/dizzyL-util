// 呈现引擎
let _engine = {
    ie: 0,
    gecko: 0,
    webkit: 0,
    khtml: 0,
    opera: 0,
    //完整的版本号
    ver: null
};
// 浏览器
let _browser = {
    ie: 0,
    firefox: 0,
    safari: 0,
    konq: 0,
    opera: 0,
    chrome: 0,
    //完整的版本号
    ver: null
};
// 平台、设备和操作系统
let _system = {
    win: false,
    mac: false,
    x11: false,
    //移动设备
    iphone: false,
    ipod: false,
    ipad: false,
    ios: false,
    android: false,
    nokiaN: false,
    winMobile: false,
    //游戏系统
    wii: false,
    ps: false,
};
// 单例
let _instance;
/**
 * 用户代理字符串检测脚本，包括检测呈现引擎、平台、Windows操作系统、移动设备
和游戏系统, 单例模型
 * 
 * @class SystemMess
 */
class SystemMess {
    constructor() {
        if (!_instance) {
            _instance = this;
            if (navigator) {
                //检测呈现引擎和浏览器
                let ua = navigator.userAgent;
                if (window.opera) {
                    _engine.ver = _browser.ver = window.opear.version();
                    _engine.opera = _browser.opera = parseFloat(_engine.ver);
                } else if (/AppleWebKit\/(\S+)/.test(ua)) {
                    _engine.ver = RegExp.$1;
                    _engine.webkit = parseFloat(_engine.ver);

                    // 确定是Chrome 还是Safari
                    if (/Chrome\/(\S+)/.test(ua)) {
                        _browser.ver = RegExp.$1;
                        _browser.chrome = parseFloat(_browser.ver);
                    } else if (/Version\/(\S+)/.test(ua)) {
                        _browser.ver = RegExp.$1;
                        _browser.safari = parseFloat(_browser.ver);
                    } else {
                        //近似地确定版本号
                        let safariVersion = 1;
                        if (_engine.webkit < 100) {
                            safariVersion = 1;
                        } else if (_engine.webkit < 312) {
                            safariVersion = 1.2;
                        } else if (_engine.webkit < 412) {
                            safariVersion = 1.3;
                        } else {
                            safariVersion = 2;
                        }
                        _browser.safari = _browser.ver = safariVersion;
                    }
                } else if (/(KHTML\/(\S+)) | (Konqueror\/([^;]+))/.test(ua)) {
                    _engine.ver = _browser.ver = RegExp.$1;
                    _engine.khtml = _browser.konq = parseFloat(_engine.ver);
                } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
                    _engine.ver = RegExp.$1;
                    _engine.gecko = parseFloat(_engine.ver);
                    //确定是不是 Firefox
                    if (/Firefox\/(\S+)/.test(ua)) {
                        _browser.ver = RegExp.$1;
                        _browser.firefox = parseFloat(_browser.ver);
                    }
                } else if (/MSIE ([^;]+)/.test(ua)) {
                    _engine.ver = _browser.ver = RegExp.$1;
                    _engine.ie = _browser.ie = parseFloat(_engine.ver);
                }

                //检测浏览器
                _browser.ie = _engine.ie;
                _browser.opera = _engine.opera;

                //检测平台
                var p = navigator.platform;
                _system.win = p.indexOf("Win") === 0;
                _system.mac = p.indexOf("Mac") === 0;
                _system.x11 = (p === "X11") || (p.indexOf("Linux") === 0);

                //检测 Windows 操作系统
                if (_system.win) {
                    if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
                        if (RegExp.$1 === "NT") {
                            switch (RegExp["$2"]) {
                                case "5.0":
                                    _system.win = "2000";
                                    break;
                                case "5.1":
                                    _system.win = "XP";
                                    break;
                                case "6.0":
                                    _system.win = "Vista";
                                    break;
                                case "6.1":
                                    _system.win = "7";
                                    break;
                                default:
                                    _system.win = "NT";
                                    break;
                            }
                        } else if (RegExp.$1 === "9x") {
                            _system.win = "ME";
                        } else {
                            _system.win = RegExp.$1;
                        }
                    }
                }

                // 移动设备
                _system.iphone = ua.indexOf("iPhone") > -1;
                _system.ipod = ua.indexOf("iPod") > -1;
                _system.ipad = ua.indexOf("iPad") > -1;
                _system.nokiaN = ua.indexOf("NokiaN") > -1;
                //windows mobile
                if (_system.win === "CE") {
                    _system.winMobile = _system.win;
                } else if (_system.win === "Ph") {
                    if (/Windows Phone OS (\d+.\d+)/.test(ua)) {
                        ;
                        _system.win = "Phone";
                        _system.winMobile = parseFloat(RegExp.$1);
                    }
                }
                //检测 iOS 版本
                if (_system.mac && ua.indexOf("Mobile") > -1) {
                    if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
                        _system.ios = parseFloat(RegExp.$1.replace("_", "."));
                    } else {
                        _system.ios = 2; //不能真正检测出来，所以只能猜测
                    }
                }
                //检测 Android 版本
                if (/Android (\d+\.\d+)/.test(ua)) {
                    _system.android = parseFloat(RegExp.$1);
                }
                //游戏系统
                _system.wii = ua.indexOf("Wii") > -1;
                _system.ps = /playstation/i.test(ua);
            }
        }
        return _instance;
    }
    get getSystemMess() {
        return ({
            engine: _engine,
            browser: _browser,
            system: _system,
        });
    }
}

// export default SystemMess;
module.exports = SystemMess;
