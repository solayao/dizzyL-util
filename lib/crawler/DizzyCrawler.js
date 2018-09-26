'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Crawler = require('crawler');
var seenreq = require('seenreq');

var _require = require('../log/ChalkConsole'),
    SuccessConsole = _require.SuccessConsole,
    ErrorConsole = _require.ErrorConsole,
    WarningConsole = _require.WarningConsole;

var _require2 = require('./PublicReg'),
    imgReg = _require2.imgReg;

/**
 * @description 对Node-Crawler的封装模块
 * @author Dizzy L
 * @export
 * @class DizzyCrawler
 */


var DizzyCrawler = function () {
    /**
     *Creates an instance of DizzyCrawler.
     * @description crawler实例适用于非react, vue, angular渲染的页面爬取
     * @author Dizzy L
     * @param {*} [options={}]  node-crawler配置
     * @memberof DizzyCrawler
     */
    function DizzyCrawler() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, DizzyCrawler);

        var defaultOptions = {
            maxConnections: 20,
            callback: function callback(error, res, done) {
                if (error) {
                    ErrorConsole('Crawler catch', __filename, error);
                } else {
                    SuccessConsole('Crawler catch', __filename, '[' + res.request.method + ' ' + res.statusCode + '] \n\t' + res.request.uri.href);
                }
                done();
            }
        };
        this.crawler = new Crawler(Object.assign({}, defaultOptions, options));
        this.seen = new seenreq();

        process.on('unhandledRejection', function (error, p) {
            // Will print "unhandledRejection err is not defined"
            WarningConsole('UnhandledRejection', __filename);
            console.log(p);
        });
    }

    /**
     * @description 获取实例中的seenreq实例
     * @author Dizzy L
     * @example https://github.com/mike442144/seenreq/blob/1.0.0/README.md
     * @returns this.seen
     * @memberof DizzyCrawler
     */


    _createClass(DizzyCrawler, [{
        key: 'getSeen',
        value: function getSeen() {
            return this.seen;
        }

        /**
         * @description 将任务加入队列，并等待其被执行。 【同步callback】
         * @author Dizzy L
         * @param {Object|Array} options node-crawler queue的options变量
         * @memberof DizzyCrawler
         */

    }, {
        key: 'queue',
        value: function queue(options) {
            this.crawler.queue(options);
        }

        /**
         * @description 将任务加入队列，并等待其被执行。 【异步callback】
         * @author Dizzy L
         * @param {Object|Array} options node-crawler queue的options变量
         * @param {function(res)} cb 通用的异步处理callback方法
         * @memberof DizzyCrawler
         * @return {Promise} Promise
         */

    }, {
        key: 'promiseQueue',
        value: function promiseQueue(options, cb) {
            var _this = this;

            if (!Array.isArray(options)) {
                /** 
                 * @description options是单个对象
                 * @return {Promise} resolve() / reject({ options })
                 */
                var catchUri = typeof options === 'string' ? options : options.uri;
                var isImage = imgReg.test(catchUri);

                return new Promise(function (resolve, reject) {
                    try {
                        var callback = function () {
                            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(error, res, done) {
                                var baseTitle, baseMess, msg;
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                if (!error) {
                                                    _context.next = 2;
                                                    break;
                                                }

                                                throw error;

                                            case 2:
                                                /** 基础的控制台信息 */
                                                baseTitle = 'Crawler Catch ' + (isImage ? 'IMAGE' : 'HTML');
                                                baseMess = '[' + res.request.method + ' ' + res.statusCode + '] \n\t' + catchUri;

                                                if (!(res.statusCode === 200)) {
                                                    _context.next = 12;
                                                    break;
                                                }

                                                _context.next = 7;
                                                return _this.seen.exists(options, function (err, rst) {
                                                    if (err) throw err;
                                                });

                                            case 7:
                                                SuccessConsole(baseTitle, __filename, baseMess);
                                                /** 执行cb */
                                                cb && cb(res);
                                                resolve();
                                                _context.next = 27;
                                                break;

                                            case 12:
                                                if (![403, 404].includes(res.statusCode)) {
                                                    _context.next = 26;
                                                    break;
                                                }

                                                msg = "";
                                                _context.t0 = res.statusCode;
                                                _context.next = _context.t0 === 403 ? 17 : _context.t0 === 404 ? 19 : 21;
                                                break;

                                            case 17:
                                                msg = '\n\tSorry, You don\'t have permission to access the URL(' + catchUri + ') on this server!';return _context.abrupt('break', 22);

                                            case 19:
                                                msg = '\n\tSorry, the URL(' + catchUri + ') is missing in the web! ' + new Date().valueOf();return _context.abrupt('break', 22);

                                            case 21:
                                                msg = '\n\tCrawler catch error.';

                                            case 22:
                                                ErrorConsole(baseTitle, __filename, '' + baseMess + msg);
                                                reject({ options: options });
                                                _context.next = 27;
                                                break;

                                            case 26:
                                                WarningConsole(baseTitle, __filename, '\u672A\u6536\u5F55\u72B6\u6001: ' + res.statusCode);

                                            case 27:
                                                /** 处理结束之后必须调用此函数 */
                                                done();

                                            case 28:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, _this);
                            }));

                            return function callback(_x2, _x3, _x4) {
                                return _ref.apply(this, arguments);
                            };
                        }();
                        /** Crawler队列配置 */
                        var configs = Object.assign((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? _extends({}, options, { callback: callback }) : { uri: options, callback: callback }, isImage ? { encoding: null, jQuery: false } : {});
                        _this.crawler.queue(configs);
                    } catch (err) {
                        ErrorConsole('During Crawler', __filename, 'Crawler在执行callback时发生了错误！');
                        reject(err);
                    }
                }).catch(function (rejectError) {
                    /** 把reject异常解除掉，并返回异常的options, 在并发处理数组时有用 */
                    return rejectError.options;
                });
            } else {
                /** options是对象数组*/
                return new Promise(function () {
                    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(resolve, reject) {
                        var errOptions, optList, groupRun;
                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                            while (1) {
                                switch (_context2.prev = _context2.next) {
                                    case 0:
                                        errOptions = [], optList = options;
                                        /**
                                         * @description 批量执行（递归）
                                         * @param {Array} optList 
                                         * @returns {Promise}
                                         */

                                        groupRun = function groupRun(optList) {
                                            return Promise.all(optList.map(function (o) {
                                                return _this.promiseQueue(o, cb);
                                            })).then(function (result) {
                                                errOptions = result.filter(function (v) {
                                                    return v;
                                                });
                                                if (errOptions.length > 0) {
                                                    var errorMsg = '' + errOptions.map(function (v, i) {
                                                        return (i ? '\n\t' : '') + '"' + v.uri + '"';
                                                    });
                                                    ErrorConsole('Group Error Crawler', __filename, errorMsg);
                                                };
                                                return;
                                            }).catch(function (err) {
                                                reject(err);
                                                // if (err.hasOwnProperty('options')) {
                                                //     const spliceIndex = optList.map(o => JSON.stringify(o)).findIndex(o => o === JSON.stringify(err.options));
                                                //     errOptions.push(optList[spliceIndex]);
                                                //     optList.splice(spliceIndex, 1);
                                                //     /** 借助seenreq达到排除已爬过的链接 */
                                                //     this.seen.exists(optList, async (e, rst) => {
                                                //         rst.forEach((v, i) => v && delete optList[i])
                                                //         const newOptList = optList.filter(o => o);
                                                //         await groupRun(newOptList);
                                                //     });
                                                // }
                                                // else {
                                                //     reject(err);
                                                // }
                                            });
                                        };

                                        _context2.next = 4;
                                        return groupRun(optList);

                                    case 4:
                                        resolve();

                                    case 5:
                                    case 'end':
                                        return _context2.stop();
                                }
                            }
                        }, _callee2, _this);
                    }));

                    return function (_x5, _x6) {
                        return _ref2.apply(this, arguments);
                    };
                }());
            }
        }

        /**
         * @description 根据配置生成crawler任务,由于执行时间过长 待优化！！！！！！！！！！！
         * @author Dizzy L
         * @param {any} [optionList=[]] 
         * @returns 
         * @memberof DizzyCrawler
         */

    }, {
        key: 'createCrawler',
        value: function createCrawler() {
            var _this2 = this;

            var optionList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            var list = optionList.map(function (o) {
                var crawlerType = o.crawlerType,
                    crawlerOptions = o.crawlerOptions,
                    catchObj = o.catchObj;

                if (crawlerType === 'promise') {
                    // 异步爬虫
                    return _this2.promiseQueue(crawlerOptions, function (res) {
                        var $ = res.$;
                        var catchKey = catchObj.catchKey,
                            catchFunc = catchObj.catchFunc,
                            catchReg = catchObj.catchReg,
                            catchSuccActions = catchObj.catchSuccActions;

                        if (catchFunc === 'each') {
                            // 捕获jq对象后要执行each方法
                            $(catchKey).each(function (index, domEle) {
                                var content = $(domEle).html();

                                var reg = _this2.regs.hasOwnProperty(catchReg) ? _this2.regs[catchReg] : catchReg; // 判断是否是全局的Regs
                                if (reg.test(content)) {
                                    // 成功匹配Reg
                                    var obj = {}; // 寄存action变量的Object

                                    catchSuccActions.forEach(function (action) {
                                        var actionType = action.actionType,
                                            actionName = action.actionName,
                                            actionFunc = action.actionFunc,
                                            actionProps = action.actionProps,
                                            actionTo = action.actionTo;


                                        if (actionType === 'eq') {
                                            obj[actionTo] = '';
                                        } else if (actionType === 'if') {} else {
                                            // 一般情况往全局变量this.nextProps的属性actionName执行actionFunc方法, 如果actionProps包含$字符串取catchReg所匹配的第n个子匹配(以括号为标志)字符串
                                            _this2.nextProps[actionName][actionFunc](actionProps.includes('$') ? RegExp[actionProps] : actionProps);
                                        }
                                    });
                                } else {
                                    // 匹配Reg失败
                                    console.log(catchKey + '\u7684\u7B2C' + index + '\u4E2A+\u914D\u7F6E[ ' + reg + ' ]\u5931\u8D25');
                                }
                            });
                        } else {// 捕获jq对象后要执行？？？？方法

                        }
                    });
                }
            });

            return Promise.all(list);
        }
    }]);

    return DizzyCrawler;
}();

module.exports = DizzyCrawler;