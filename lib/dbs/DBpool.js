'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var genericPool = require('generic-pool');
var emptyFunc = require('fbjs/lib/emptyFunction');

var _require = require('../log/ChalkConsole'),
    ErrorConsole = _require.ErrorConsole,
    SuccessConsole = _require.SuccessConsole;
/**
 * @description 数据库连接池
 * @git https://github.com/coopernurse/node-pool
 * @author Dizzy L
 * @class DBPool
 */


var DBPool = function () {
    /**
     * Creates an instance of DBPool.
     * @author Dizzy L
     * @param {function} [connectFunc=emptyFunc] a function that the pool will call when it wants a new resource. It should return a Promise that either resolves to a resource or rejects to an Error if it is unable to create a resource for whatever reason.
     * @param {(client) => emptyFunc} [disconnectFunc] a function that the pool will call when it wants to destroy a resource. It should accept one argument resource where resource is whatever factory.create made. The destroy function should return a Promise that resolves once it has destroyed the resource.
     * @param {any} [opts={max: 10, min: 2}] 连接池配置项
     * @memberof DBPool
     */
    function DBPool() {
        var connectFunc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : emptyFunc;
        var disconnectFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (client) {
            return emptyFunc();
        };
        var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { max: 20, min: 2 };

        _classCallCheck(this, DBPool);

        var factory = {
            create: connectFunc,
            destroy: function destroy(client) {
                return disconnectFunc(client);
            }
        };
        this.pool = genericPool.createPool(factory, opts);

        process.on('unhandledRejection', function (reason, p) {
            ErrorConsole('Unhandled Rejection At: Promise ', 'DBpool');
            console.log(p);
        });
    }

    /**
     * @description 数据库操作执行函数
     * @author Dizzy L
     * @param {(dbClient) => return Promise} [actionFunc=(dbClient) => emptyFunc()] dbClient: 相应数据库连接实例资源
     * @param {String} filename
     * @memberof DBPool
     * @returns {Promise} actionFunc()结果
     */


    _createClass(DBPool, [{
        key: 'sqlAction',
        value: function sqlAction() {
            var _this = this;

            var actionFunc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (dbClient) {
                return emptyFunc();
            };
            var filename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __filename;

            return this.pool.use(function (dbClient) {
                return actionFunc(dbClient);
            }).then(function (result) {
                SuccessConsole('DBpool Message', filename, 'Release 1 connection, pool.size is ' + _this.pool.size + ', pool.available is ' + _this.pool.available);
                return result;
            }).catch(function (err) {
                return SuccessConsole('DBpool Message', filename, 'Destroy 1 connection, pool.size is ' + _this.pool.size + ', pool.available is ' + _this.pool.available);
            });
        }

        /**
         * @description 关闭连接池
         * @author Dizzy L
         * @memberof DBPool
         */

    }, {
        key: 'closePool',
        value: function closePool() {
            var _this2 = this;

            this.pool.drain().then(function () {
                _this2.pool.clear();
                // SuccessConsole('Close DBpool Message', __filename, 'Successful!');
            });
        }
    }]);

    return DBPool;
}();

module.exports = DBPool;