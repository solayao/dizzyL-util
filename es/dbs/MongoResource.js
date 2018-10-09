const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;
const DBpool = require('./DBpool');
const { mongoConfig } = require('./config.json');
const { SuccessConsole, ErrorConsole, InsertConsole } = require('../log/ChalkConsole');

const dbName = mongoConfig.db;

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
                mongoUrl = `mongodb://${options.user}:${options.pass}@${options.host}:${options.port}/${options.db}`;
            } else {
                mongoUrl = `mongodb://${options.host}:${options.port}/${options.db}`;
            }
        }

        const connectFunc = () => {
            return MongoClient.connect(mongoUrl, { useNewUrlParser: true })
            .then(client => {
                SuccessConsole('DBpool message', __filename,`Connected MongoDB (${mongoUrl}) successfully to server.`)
                return client;
            })
            .catch(err => {
                ErrorConsole('DBpool message', __filename, `Connected MongoDB (${mongoUrl}) NOT successfully to server!\n\t${err}`)
            });
        };
        const disconnectFunc = (client) => {
            client.close();
            SuccessConsole('DBpool message', __filename,`Closed MongoDB (${mongoUrl}) successfully to server.`)
        };
        
        this.mongoPool = Object.keys(poolOptions).length > 0 ? new DBpool(connectFunc, disconnectFunc, poolOptions) 
            : new DBpool(connectFunc, disconnectFunc);
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
     * @description Mongo数据库Insert操作
     * @author Dizzy L
     * @param {string} [collection=''] mongo的集合名
     * @param {Object/Array} [doc={}/[{}]] 要插入的数据/数据数组
     * @memberof MongoResource
     * @returns {Array} 插入到MongoDB的ids数组
     */
    actionInsert(collection = '', doc = null) {
        if (!doc || collection === '') return;
        if (Array.isArray(doc) && doc.length === 0) return [];
        return this.mongoPool.sqlAction(client => {
            return new Promise((resolve, reject) => {
                client.db(dbName).collection(collection).insert(doc)
                .then(msg => {
                    if(msg.result.hasOwnProperty('ok')) {
                        SuccessConsole('DBpool message', __filename,`Insert (\n${JSON.stringify(doc)}\n) to (${collection}) successfully.`);
                        InsertConsole('DBpool message', __filename,`Insert (\n${JSON.stringify(doc)}\n) to (${collection}) successfully.`);
                        resolve(Object.values(msg.insertedIds));
                    }
                })
                .catch(err => reject(err));
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
    actionQuery(collection = '', doc = null) {
        if (!doc || collection === '') return;
        return this.mongoPool.sqlAction(client => {
            return new Promise((resolve, reject) => {
                try{
                    client.db(dbName).collection(collection).find(doc).toArray((err, msg) => {
                        // console.log(msg);
                        resolve(msg);
                    })
                } catch (err) {
                    console.log(err)
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
    actionAggregate(collection = '', doc = null) {
        if (!doc || collection === '') return;
        return this.mongoPool.sqlAction(client => {
            return new Promise((resolve, reject) => {
                try{
                    client.db(dbName).collection(collection).aggregate(doc).toArray((err, msg) => {
                        // console.log(msg);
                        resolve(msg);
                    })
                } catch (err) {
                    console.log(err)
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
    actionUpdate(collection = '', filter = null, doc = null, upsert = false, multi = false) {
        if (!doc || !filter || !doc) return;
        return this.mongoPool.sqlAction(client => {
            return new Promise((resolve, reject) => {
                client.db(dbName).collection(collection).update(filter, doc, { upsert, multi })
                .then(msg => {
                    // console.log(msg)
                    SuccessConsole('DBpool message', __filename, `Update (\n${JSON.stringify(doc)}\n) to (${collection}) successfully.`);
                    InsertConsole('DBpool message', __filename, `Update (\n${JSON.stringify(doc)}\n) to (${collection}) successfully.`);
                    resolve();
                })
                .catch(err => reject(err))
            });
        })
    }

    /**
     * 获取mongo实例自行编写方法
     * @param {Promise} [promiseFunc=(client) =>　{}] client实例将要执行的方法
     * @returns 
     * @memberof MongoResource
     */
    actionForClient(promiseFunc = (client) =>　{})　{
        return this.mongoPool.sqlAction(client => {
            return promiseFunc(client);
        })
    }

    /**
     * 以n查询comic下的非重复集合
     *
     * @returns
     * @memberof MongoResource
     */
    distinct() {
        return this.mongoPool.sqlAction(client => {
            return new Promise((resolve, reject) => {
                client.db(dbName).collection('comic').distinct('n')
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
