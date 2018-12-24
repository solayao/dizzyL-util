const MongoDB = require('mongodb');
const emptyFunc = require('fbjs/lib/emptyFunction');
const MongoClient = MongoDB.MongoClient;
const DBpool = require('./DBpool');
const { mongoConfig, dbs } = require('./config.json');
const { SuccessConsole, ErrorConsole, WarningConsole } = require('../log/ChalkConsole');
const { isNotEmpty } = require('../type');

const defaultDBName = dbs[0];
const getOpt = (message) => ({
    title: 'DBpool message',
    pathName: __filename,
    message,
});

/**
 * @description Mongo连接池
 * @author Dizzy L
 * @class MongoResource
 */
class MongoResource {

    /**
     * Creates an instance of MongoResource.
     * @author Dizzy L
     * @param {any} [options=mongoConfig]
     * @param {any} [poolOptions={}]
     * @memberof MongoResource
     */
    constructor(options = mongoConfig, poolOptions = {}) {
        let mongoUrl = options.uri || options.url;

        if (!mongoUrl) {
            if (options.user && options.pass) {
                mongoUrl = `mongodb://${options.user}:${options.pass}@${options.host}:${options.port}`;
            } else {
                mongoUrl = `mongodb://${options.host}:${options.port}`;
            }
        }
        if (isNotEmpty(options.search)) {
            mongoUrl += '?' + Object.keys(options.search).map(k => `${k}=${options.search[k]}`).join('&');
        }
        const connectFunc = () => {
            return MongoClient
                .connect(mongoUrl, { useNewUrlParser: true })
                .then(client => {
                    let opt = getOpt(`Connected MongoDB (${mongoUrl}) successfully to server.`);
                    SuccessConsole(opt);
                    opt = null;
                    return client;
                })
                .catch(err => {
                    let opt = getOpt(`Connected MongoDB (${mongoUrl}) NOT successfully to server!\n\t${err}`);
                    ErrorConsole(opt);
                    opt = null;
                });
        };
        const disconnectFunc = (client) => {
            client.close();
            let opt = getOpt(`Closed MongoDB (${mongoUrl}) successfully to server.`);
            SuccessConsole(opt);
            opt = null;
        };

        this.mongoPool = isNotEmpty(poolOptions) ? new DBpool(connectFunc, disconnectFunc, poolOptions)
            : new DBpool(connectFunc, disconnectFunc);

        process.on('unhandledRejection', (rejectReason, rejectPromise) => {
            let opt = {
                title: 'Unhandled Rejection At: Promise ',
                pathName: __filename,
                message: rejectReason.stack
            }
            ErrorConsole(opt);
            opt = null;
        });
    }

    /**
     * @description 关闭该Mongo连接池
     * @author Dizzy L
     * @memberof MongoResource
     */
    close() {
        this.mongoPool.closePool();
    }

    /**
     *  Mongo对执行pool执行sqlAction的再封装
     * @param {*} actionFunc
     * @returns
     * @memberof MongoResource
     */
    action(actionFunc) {
        return this.mongoPool.sqlAction(actionFunc, __filename);
    }

    /**
     * @description Mongo数据库Insert操作
     * @author Dizzy L
     * @param {string} [collection=''] mongo的集合名
     * @param {Object/Array} [doc={}/[{}]] 要插入的数据/数据数组
     * @param {String} dbName
     * @memberof MongoResource
     * @returns {Array} 插入到MongoDB的ids数组
     */
    actionInsert(collection = '', doc = null, dbName = defaultDBName) {
        if (!doc || collection === '')
            return;
        if (Array.isArray(doc) && doc.length === 0)
            return [];
        return this.action(client => {
            return new Promise((resolve, reject) => {
                client
                    .db(dbName)
                    .collection(collection)
                    .insert(doc)
                    .then(msg => {
                        if (msg.result.hasOwnProperty('ok')) {
                            let opt = getOpt(`Insert (${JSON.stringify(doc)}) to (${collection}) successfully.`);
                            WarningConsole(opt);
                            opt = null;
                            resolve(Object.values(msg.insertedIds));
                        }
                    })
            });
        });
    }
    /**
     * @description Mongo数据库find操作
     * @author Dizzy L
     * @param {string} [collection=''] mongo的集合名
     * @param {Object} [doc={}] 查询操作符指定查询条件
     * @param {String} dbName
     * @memberof MongoResource
     * @returns {Array} 查询到的结果数组
     */
    actionQuery(collection = '', doc = null, dbName = defaultDBName) {
        if (!doc || collection === '')
            return;
        return this.action(client => {
            return new Promise((resolve, reject) => {
                client
                    .db(dbName)
                    .collection(collection)
                    .find(doc)
                    .toArray((err, msg) => resolve(msg))
            });
        });
    }

    /**
     * @description Mongo数据库aggregate操作
     * @url https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/
     * @author Dizzy L
     * @param {string} [collection=''] mongo的集合名
     * @param {Array} [doc=[ { <stage> }, ... ]] 聚合操作符指定条件
     * @param {String} dbName
     * @memberof MongoResource
     * @returns {Array} 查询到的结果数组
     */
    actionAggregate(collection = '', doc = null, dbName = defaultDBName) {
        if (!doc || collection === '')
            return;
        return this.action(client => {
            return new Promise((resolve, reject) => {
                client
                    .db(dbName)
                    .collection(collection)
                    .aggregate(doc)
                    .toArray((err, msg) => resolve(msg))
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
     * @param {String} dbName
     * @returns
     * @memberof MongoResource
     */
    actionUpdate(
        collection = '',
        filter = null,
        doc = null,
        upsert = false,
        multi = false,
        dbName = defaultDBName
    ) {
        if (!doc || !filter || !doc)
            return;
        return this.action(client => {
            return new Promise((resolve, reject) => {
                client
                    .db(dbName)
                    .collection(collection)
                    .update(filter, doc, { upsert, multi })
                    .then(msg => {
                        let opt = getOpt(`Update (${JSON.stringify(doc)}) to (${collection}) successfully.`)
                        WarningConsole(opt);
                        opt = null;
                        resolve(msg);
                    })
            });
        })
    }

    /**
     * 获取mongo实例自行编写方法
     * @param {Promise} [promiseFunc=(client) =>　{}] client实例将要执行的方法
     * @returns promiseFunc的结果
     * @memberof MongoResource
     */
    actionForClient(promiseFunc = emptyFunc) {
        return this.action(client => Promise.resolve(promiseFunc(client)))
    }

    /**
     * 以n查询comic下的非重复集合
     *
     * @returns
     * @memberof MongoResource
     */
    distinct() {
        return this.action(client => {
            return new Promise((resolve, reject) => {
                client
                    .db(dbName)
                    .collection('comic')
                    .distinct('n')
                    .then(msg => {
                        resolve(msg);
                    })
                    .catch(err => reject(err));
            });
        })
    }

}

module.exports = MongoResource;

// mongo 删除重复项
// db.comic.aggregate([{
//     $group: {
//         _id: {
//             name:
//                 '$n'
//         }, count: { $sum: 1 }, dups: { $addToSet: '$_id' }
//     }
// }, {
//     $match: { count: { $gt: 1 } }
// }]).forEach(function (doc) {
//     doc.dups.shift();
//     doc.dups.forEach(function (d) {
//         db.chapter.remove({ _id: { $in: d.dM } });
//         db.chapter.remove({ _id: { $in: d.dO } });
//     });
//     db.comic.remove({ _id: { $in: doc.dups } });
// })

// db.chapter.aggregate([{
//     $group: {
//         _id: { name: '$link' }, count:
//             { $sum: 1 }, dups: { $addToSet: '$_id' }
//     }
// }, {
//     $match: {
//         count:
//             { $gt: 1 }
//     }
// }])


// let test1 = db.comic.aggregate([
//     {$project: { dM:1, dO: 1 }},
// ]).toArray().reduce(function(total, current){
//     total = total.concat(current.dM, current.dO)
//     return total;
// }, []);
// db.chapter.remove({ _id: { $nin: test1 } });
// test1 = null;

(async () => {
    const mongo = new MongoResource();
    let a = await mongo.actionForClient(client => client.db('crawlerDL').collection('comic')
        .find()
        .limit(1)
        .toArray()
    )
    console.log(a);
    await mongo.close();
})()