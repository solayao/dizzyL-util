'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
            var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var doc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            if (!doc || collection === '') return;
            return this.mongoPool.sqlAction(function (client) {
                return new Promise(function (resolve, reject) {
                    try {
                        client.db(dbName).collection(collection).find(doc).toArray(function (err, msg) {
                            // console.log(msg);
                            resolve(msg);
                        });
                    } catch (err) {
                        console.log(err);
                    }
                });
            });
        }

        /**
         * @description Mongo数据库aggregate操作
         * @url https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/
         * @author Dizzy L
         * @param {string} [collection=''] mongo的集合名
         * @param {Array} [doc=[ { <stage> }, ... ]] 聚合操作符指定条件
         * @memberof MongoResource
         * @returns {Array} 查询到的结果数组
         */

    }, {
        key: 'actionAggregate',
        value: function actionAggregate() {
            var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var doc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            if (!doc || collection === '') return;
            return this.mongoPool.sqlAction(function (client) {
                return new Promise(function (resolve, reject) {
                    try {
                        client.db(dbName).collection(collection).aggregate(doc).toArray(function (err, msg) {
                            // console.log(msg);
                            resolve(msg);
                        });
                    } catch (err) {
                        console.log(err);
                    }
                });
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
            var upsert = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
            var multi = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

            if (!doc || !filter || !doc) return;
            return this.mongoPool.sqlAction(function (client) {
                return new Promise(function (resolve, reject) {
                    client.db(dbName).collection(collection).update(filter, doc, { upsert: upsert, multi: multi }).then(function (msg) {
                        // console.log(msg)
                        SuccessConsole('DBpool message', __filename, 'Update (\n' + JSON.stringify(doc) + '\n) to (' + collection + ') successfully.');
                        InsertConsole('DBpool message', __filename, 'Update (\n' + JSON.stringify(doc) + '\n) to (' + collection + ') successfully.');
                        resolve();
                    }).catch(function (err) {
                        return reject(err);
                    });
                });
            });
        }

        /**
         * 获取mongo实例自行编写方法
         * @param {Promise} [promiseFunc=(client) =>　{}] client实例将要执行的方法
         * @returns 
         * @memberof MongoResource
         */

    }, {
        key: 'actionForClient',
        value: function actionForClient() {
            var promiseFunc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (client) {};

            return this.mongoPool.sqlAction(function (client) {
                return promiseFunc(client);
            });
        }

        /**
         * 以n查询comic下的非重复集合
         *
         * @returns
         * @memberof MongoResource
         */

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