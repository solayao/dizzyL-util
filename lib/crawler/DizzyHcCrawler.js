'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HCCrawler = require('headless-chrome-crawler');

var _require = require('../log/ChalkConsole'),
    SuccessConsole = _require.SuccessConsole,
    ErrorConsole = _require.ErrorConsole,
    WarningConsole = _require.WarningConsole;

/**
 * @description 对Headless-chrome-crawler的封装模块
 * @author Dizzy L
 * @class DizzyHcCrawler
 */


var DizzyHcCrawler = function () {
    /**
     *Creates an instance of DizzyHcCrawler.
     * @description crawler实例适用于react, vue, angular和js动态渲染的页面爬取
     * @author Dizzy L
     * @memberof DizzyHcCrawler
     */
    function DizzyHcCrawler() {
        _classCallCheck(this, DizzyHcCrawler);

        this.crawler = null;

        process.on('unhandledRejection', function (error, p) {
            // Will print "unhandledRejection err is not defined"
            WarningConsole('UnhandledRejection', 'DizzyHcCrawler');
            console.log(p);
        });
    }

    /**
     * @description
     * @author Dizzy L
     * @param {*} { evaluatePage = {}, onSuccessCB = (rst) => {} }
     * @memberof DizzyHcCrawler
     */


    _createClass(DizzyHcCrawler, [{
        key: 'create',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
                var _this = this;

                var _ref$evaluatePage = _ref.evaluatePage,
                    evaluatePage = _ref$evaluatePage === undefined ? function () {
                    return {};
                } : _ref$evaluatePage,
                    _ref$onSuccessCB = _ref.onSuccessCB,
                    onSuccessCB = _ref$onSuccessCB === undefined ? function (rst) {} : _ref$onSuccessCB;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return HCCrawler.launch({
                                    // Function to be evaluated in browsers
                                    evaluatePage: evaluatePage,
                                    // Function to be called with evaluated results from browsers
                                    onSuccess: function onSuccess(rst) {
                                        onSuccessCB(rst);
                                        SuccessConsole('Crawler Catch HTML', __filename, '[GET ' + rst.response.status + '] \n\t' + rst.response.url);
                                    },
                                    onError: function onError(error) {
                                        ErrorConsole('Crawler Catch Error', __filename, error);
                                    }
                                });

                            case 2:
                                this.crawler = _context.sent;

                                this.crawler.on('requeststarted', function (options) {
                                    SuccessConsole('Crawler Catch HTML', __filename, '[HC START] \n\t' + options.url);
                                });
                                this.crawler.on('requestskipped', function (options) {
                                    SuccessConsole('Crawler Catch HTML', __filename, '[HC SKIP TO] \n\t' + options.url);
                                });
                                this.crawler.on('requestfinished', function (options) {
                                    SuccessConsole('Crawler Catch HTML', __filename, '[HC FINISH] \n\t' + options.url);
                                });
                                this.crawler.on('requestretried', function (options) {
                                    WarningConsole('Crawler Catch HTML', __filename, '[HC RETRIED] \n\t' + options.url);
                                });
                                this.crawler.on('requestfailed', function (err) {
                                    console.log(err);
                                    ErrorConsole('Crawler Catch Error', __filename, '[HC FAILED] \n\t' + JSON.stringify(err));
                                });
                                this.crawler.on('maxdepthreached', function (options) {
                                    ErrorConsole('Crawler Catch Error', __filename, '[HC FAILED] maxdepthreached \n\t' + options.url);
                                    _this.close();
                                });
                                this.crawler.on('maxrequestreached', function () {
                                    ErrorConsole('Crawler Catch Error', __filename, '[HC FAILED] maxrequestreached');
                                    _this.close();
                                });
                                this.crawler.on('disconnected', function () {
                                    SuccessConsole('Crawler Catch HTML', __filename, '[HC DISCONNECTED] successful');
                                });

                            case 11:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function create(_x) {
                return _ref2.apply(this, arguments);
            }

            return create;
        }()

        /**
         * @description 将任务加入队列，并等待执行
         * @author Dizzy L
         * @param {String|Array|Object} uri 爬取的地址任务
         * @memberof DizzyHcCrawler
         */

    }, {
        key: 'queue',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(uri) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.crawler.queue(uri);

                            case 2:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function queue(_x2) {
                return _ref3.apply(this, arguments);
            }

            return queue;
        }()
    }, {
        key: 'close',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.crawler.onIdle();

                            case 2:
                                _context3.next = 4;
                                return this.crawler.close();

                            case 4:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function close() {
                return _ref4.apply(this, arguments);
            }

            return close;
        }()
    }]);

    return DizzyHcCrawler;
}();

module.exports = DizzyHcCrawler;