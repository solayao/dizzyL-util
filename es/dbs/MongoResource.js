'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MongoDB = require('mongodb');
var MongoClient = MongoDB.MongoClient;
var DBpool = require('./DBpool');

var _require = require('./config.json'),
    mongoConfig = _require.mongoConfig;

var _require2 = require('../log/ChalkConsole'),
    SuccessConsole = _require2.SuccessConsole,
    ErrorConsole = _require2.ErrorConsole,
    InsertConsole = _require2.InsertConsole;

var dbName = mongoConfig.db;

/**
 * @description Mongo连接池
 * @author Dizzy L
 * @class MongoResource
 */

var MongoResource = function () {

    /**
     * Creates an instance of MongoResource.
     * @author Dizzy L
     * @param {any} [options=mongoConfig] 
     * @param {any} [poolOptions={}] 
     * @memberof MongoResource
     */
    function MongoResource() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mongoConfig;
        var poolOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, MongoResource);

        var mongoUrl = options.uri || options.url;

        if (!mongoUrl) {
            if (options.user && options.pass) {
                mongoUrl = 'mongodb://' + options.user + ':' + options.pass + '@' + options.host + ':' + options.port + '/' + options.db;
            } else {
                mongoUrl = 'mongodb://' + options.host + ':' + options.port + '/' + options.db;
            }
        }

        var connectFunc = function connectFunc() {
            return MongoClient.connect(mongoUrl, { useNewUrlParser: true }).then(function (client) {
                SuccessConsole('DBpool message', __filename, 'Connected MongoDB (' + mongoUrl + ') successfully to server.');
                return client;
            }).catch(function (err) {
                ErrorConsole('DBpool message', __filename, 'Connected MongoDB (' + mongoUrl + ') NOT successfully to server!\n\t' + err);
            });
        };
        var disconnectFunc = function disconnectFunc(client) {
            client.close();
            SuccessConsole('DBpool message', __filename, 'Closed MongoDB (' + mongoUrl + ') successfully to server.');
        };

        this.mongoPool = Object.keys(poolOptions).length > 0 ? new DBpool(connectFunc, disconnectFunc, poolOptions) : new DBpool(connectFunc, disconnectFunc);
    }

    /**
     * @description 关闭该Mongo连接池
     * @author Dizzy L
     * @memberof MongoResource
     */


    _createClass(MongoResource, [{
        key: 'close',
        value: function close() {
            this.mongoPool.closePool();
        }

        /**
         * @description Mongo数据库Insert操作
         * @author Dizzy L
         * @param {string} [collection=''] mongo的集合名
         * @param {Object/Array} [doc={}/[{}]] 要插入的数据/数据数组
         * @memberof MongoResource
         * @returns {Array} 插入到MongoDB的ids数组
         */

    }, {
        key: 'actionInsert',
        value: function actionInsert() {
            var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var doc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            if (!doc || collection === '') return;
            if (Array.isArray(doc) && doc.length === 0) return [];
            return this.mongoPool.sqlAction(function (client) {
                return new Promise(function (resolve, reject) {
                    client.db(dbName).collection(collection).insert(doc).then(function (msg) {
                        if (msg.result.hasOwnProperty('ok')) {
                            SuccessConsole('DBpool message', __filename, 'Insert (\n' + JSON.stringify(doc) + '\n) to (' + collection + ') successfully.');
                            InsertConsole('DBpool message', __filename, 'Insert (\n' + JSON.stringify(doc) + '\n) to (' + collection + ') successfully.');
                            resolve(Object.values(msg.insertedIds));
                        }
                    }).catch(function (err) {
                        return reject(err);
                    });
                });
            });
        }
        /**
         * @description Mongo数据库find操作
         * @author Dizzy L
         * @param {string} [collection=''] mongo的集合名
         * @param {Object} [doc={}] 查询操作符指定查询条件
         * @memberof MongoResource
         * @returns {Array} 查询到的结果数组
         */

    }, {
        key: 'actionQuery',
        value: function actionQuery() {
            var _this = this;

            var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var doc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            if (!doc || collection === '') return;
            return this.mongoPool.sqlAction(function (client) {
                return new Promise(function () {
                    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {
                        return regeneratorRuntime.wrap(function _callee$(_context) {
                            while (1) {
                                switch (_context.prev = _context.next) {
                                    case 0:
                                        try {
                                            client.db(dbName).collection(collection).find(doc).toArray(function (err, msg) {
                                                // console.log(msg);
                                                resolve(msg);
                                            });
                                        } catch (err) {
                                            console.log(err);
                                        }

                                    case 1:
                                    case 'end':
                                        return _context.stop();
                                }
                            }
                        }, _callee, _this);
                    }));

                    return function (_x7, _x8) {
                        return _ref.apply(this, arguments);
                    };
                }());
            });
        }

        /**
         * @description Mongo数据库update操作
         * @author Dizzy L
         * @param {string} [collection=''] 集合名
         * @param {*} [filter=null] 过滤条件
         * @param {*} [doc=null] 设置的值
         * @param {boolean} [upsert=false] 不存在数据时是否插入数据
         * @param {boolean} [multi=false] 只更新查询到第一条
         * @returns 
         * @memberof MongoResource
         */

    }, {
        key: 'actionUpdate',
        value: function actionUpdate() {
            var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var doc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            var _this2 = this;

            var upsert = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
            var multi = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

            if (!doc || !filter || !doc) return;
            return this.mongoPool.sqlAction(function (client) {
                return new Promise(function () {
                    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(resolve, reject) {
                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                            while (1) {
                                switch (_context2.prev = _context2.next) {
                                    case 0:
                                        client.db(dbName).collection(collection).update(filter, doc, { upsert: upsert, multi: multi }).then(function (msg) {
                                            // console.log(msg)
                                            SuccessConsole('DBpool message', __filename, 'Update (\n' + JSON.stringify(doc) + '\n) to (' + collection + ') successfully.');
                                            InsertConsole('DBpool message', __filename, 'Update (\n' + JSON.stringify(doc) + '\n) to (' + collection + ') successfully.');
                                            resolve();
                                        }).catch(function (err) {
                                            return reject(err);
                                        });

                                    case 1:
                                    case 'end':
                                        return _context2.stop();
                                }
                            }
                        }, _callee2, _this2);
                    }));

                    return function (_x14, _x15) {
                        return _ref2.apply(this, arguments);
                    };
                }());
            });
        }
    }, {
        key: 'distinct',
        value: function distinct() {
            return this.mongoPool.sqlAction(function (client) {
                return new Promise(function (resolve, reject) {
                    client.db(dbName).collection('comic').distinct('n').then(function (msg) {
                        resolve(msg);
                    }).catch(function (err) {
                        return reject(err);
                    });
                });
            });
        }
    }]);

    return MongoResource;
}();

module.exports = MongoResource;

// mongo 删除重复项
// db.comic.aggregate([
//     {
//         $group: { _id: {name: '$n'},count: {$sum: 1},dups: {$addToSet: '$_id'}}
//     },
//     {
//         $match: {count: {$gt: 1}}
//     }
//   ]).forEach(function(doc){
//     doc.dups.shift();
//     doc.dups.forEach(function(d){
//       db.chapter.remove({_id: {$in: d.dM}});
//       db.chapter.remove({_id: {$in: d.dO}});
//     });
//     db.comic.remove({_id: {$in: doc.dups}});
//   })


//   db.chpater.aggregate([
//     {
//         $group: { _id: {name: '$link'},count: {$sum: 1},dups: {$addToSet: '$_id'}}
//     },
//     {
//         $match: {count: {$gt: 1}}
//     }
//   ])