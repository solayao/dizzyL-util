'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Redis = require('redis');
var bluebird = require('bluebird');
bluebird.promisifyAll(Redis);

var DBpool = require('./DBpool');

var _require = require('./config.json'),
    redisConfig = _require.redisConfig;

var _require2 = require('../log/ChalkConsole'),
    SuccessConsole = _require2.SuccessConsole,
    ErrorConsole = _require2.ErrorConsole;

/**
 * @description Redis连接池
 * @git https://github.com/NodeRedis/node_redis
 * @author Dizzy L
 * @class RedisResource
 */


var RedisResource = function () {
    function RedisResource() {
        var _this = this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : redisConfig;
        var poolOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, RedisResource);

        var defaultOpt = {
            retry_strategy: function retry_strategy(options) {
                if (options.error && options.error.code === 'ECONNREFUSED') {
                    // End reconnecting on a specific error and flush all commands with a individual
                    // error
                    ErrorConsole('DBpool Message', __filename, '' + options.error);
                    return new Error('The server refused the connection');
                }
                if (options.total_retry_time > 1000 * 60 * 60) {
                    // End reconnecting after a specific timeout and flush all commands with a
                    // individual error
                    ErrorConsole('DBpool Message', __filename, 'Retry time exhausted');
                    return new Error('Retry time exhausted');
                }
                if (options.attempt > 10) {
                    // End reconnecting with built in error
                    return undefined;
                }
                // reconnect after
                return Math.min(options.attempt * 100, 3000);
            }
        };
        var connectFunc = function connectFunc() {
            var redis = Redis.createClient(Object.assign({}, options, defaultOpt));
            SuccessConsole('DBpool Message', __filename, 'Connected Reids (' + redisConfig.host + ':' + redisConfig.port + ') successfully to server.');
            return redis;
        };
        var disconnectFunc = function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(client) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return client.quit();

                            case 2:
                                // await client.end(true);
                                SuccessConsole('DBpool Message', __filename, 'Closed Reids (' + redisConfig.host + ':' + redisConfig.port + ') successfully to server.');

                            case 3:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, _this);
            }));

            return function disconnectFunc(_x3) {
                return _ref.apply(this, arguments);
            };
        }();

        this.redisPool = Object.keys(poolOptions).length > 0 ? new DBpool(connectFunc, disconnectFunc, poolOptions) : new DBpool(connectFunc, disconnectFunc);
    }

    /**
     * @description 关闭该Redis连接池
     * @author Dizzy L
     * @memberof RedisResource
     */


    _createClass(RedisResource, [{
        key: 'close',
        value: function close() {
            this.redisPool.closePool();
        }

        /**
         *  Redis对执行pool执行sqlAction的再封装
         * @param {*} actionFunc
         * @returns
         * @memberof MongoResource
         */

    }, {
        key: 'action',
        value: function action(actionFunc) {
            return this.redisPool.sqlAction(actionFunc, __filename);
        }

        /**
         * @description Redis的lpush操作
         * @author Dizzy L
         * @param {string} key 要插入的数组Key
         * @param {array} arr 带插入的数组
         * @param {Number} expire 过期时间(s)
         * @memberof RedisResource
         */

    }, {
        key: 'lPush',
        value: function lPush() {
            var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
            var arr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
            var expire = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;

            this.action(function (client) {
                return client.LPUSHAsync.apply(client, [key].concat(_toConsumableArray(arr))).then(function (data) {
                    if (expire !== -1) client.EXPIREAsync(key, expire);
                    return data;
                });
            });
        }

        /**
         * @description Redis的lrange操作
         * @author Dizzy L
         * @param {string} key 需要查询的关键 key
         * @param {array} length 要查询的开始和结束index数组, 默认[0, -1]查询key的结果的所有长度
         * @memberof RedisResource
         */

    }, {
        key: 'lRange',
        value: function lRange() {
            var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
            var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, -1];

            this.action(function (client) {
                return client.LRANGEAsync.apply(client, [key].concat(_toConsumableArray(length)));
            });
        }

        /**
         * @description Redis的哈希设置
         * @author Dizzy L
         * @param {string} key 要插入的哈希Key
         * @param {*} paramsObj 带插入的对象
         * @param {Number} expire 过期时间(s)
         * @memberof RedisResource
         */

    }, {
        key: 'hmSet',
        value: function hmSet() {
            var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
            var paramsObj = arguments[1];
            var expire = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;

            this.action(function (client) {
                return new Promise(function (resolve, reject) {
                    if (key) client.HMSETAsync(key, paramsObj).then(function () {
                        if (expire !== -1) client.EXPIREAsync(key, expire);
                        resolve();
                    }).catch(function (err) {
                        return reject(err);
                    });
                });
            });
        }

        /**
         * @description Redis的获取在哈希表中指定 key 的所有字段和值
         * @author Dizzy L
         * @param {string} [key=""] 需要查询的关键 key
         * @returns {Object} 指定 key 的所有字段和值
         * @memberof RedisResource
         */

    }, {
        key: 'hgetAll',
        value: function hgetAll() {
            var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

            return this.action(function (client) {
                return new Promise(function (resolve, reject) {
                    if (key) client.HGETALLAsync(key).then(function (data) {
                        return resolve(data);
                    }).catch(function (err) {
                        return reject('err', err);
                    });
                });
            });
        }

        /**
         * @description Redis的获取所有keys
         * @author Dizzy L
         * @param {string} [key=""] 给定模式 pattern 的 key
         * @returns {Promise} keys的List
         * @memberof RedisResource
         */

    }, {
        key: 'keys',
        value: function keys() {
            var pattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "*";

            return this.action(function (client) {
                return new Promise(function (resolve, reject) {
                    client.KEYSAsync(pattern).then(function (data) {
                        return resolve(data);
                    }).catch(function (err) {
                        return reject('err', err);
                    });
                });
            });
        }

        /**
         * @description Redis的清空所有键值
         * @author Dizzy L
         * @returns {Promise}
         * @memberof RedisResource
         */

    }, {
        key: 'flushall',
        value: function flushall() {
            return this.action(function (client) {
                return client.FLUSHALLAsync();
            });
        }

        /**
         * 获取mongo实例自行编写方法
         * @param {Promise} [promiseFunc=(client) =>　{}] client实例将要执行的方法
         * @returns
         * @memberof RedisResource
         */

    }, {
        key: 'actionForClient',
        value: function actionForClient() {
            var promiseFunc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (client) {};

            return this.action(function (client) {
                return promiseFunc(client);
            });
        }
    }]);

    return RedisResource;
}();

module.exports = RedisResource;

// (async() => { const r = new RedisResource(); await r.hmSet('test', {param1:
// 'test1', param2: 'test2'}); const r2 = new RedisResource(); await
// r2.hmSet('test3', {param1: 'test1', param2: 'test2'}); await r.hmSet('test2',
// {param1: 'test1', param2: 'test2'}); await r.close(); await r2.hmSet('test4',
// {param1: 'test1', param2: 'test2'}); await r.hmSet('2015-1', {param1:
// 'test1', param2: 'test2'}); await r.hmSet('2016-1', {param1: 'test1', param2:
// 'test2'}); await r.hmSet('2016-4', {param1: 'test1', param2: 'test2'},
// 10000); await r.hmSet('2016-5', {param1: 'test1', param2: 'test2'}); await
// r.flushall(); console.log(await r.keys()); let fir = await
// r.hgetAll(test[0]); await r.close(); })();