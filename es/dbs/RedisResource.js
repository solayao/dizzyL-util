const Redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(Redis);

const DBpool = require('./DBpool');
const {redisConfig} = require('./config.json');
const {SuccessConsole, ErrorConsole} = require('../log/ChalkConsole');

/**
 * @description Redis连接池
 * @git https://github.com/NodeRedis/node_redis
 * @author Dizzy L
 * @class RedisResource
 */
class RedisResource {
    constructor(options = redisConfig, poolOptions = {}) {
        const defaultOpt = {
            retry_strategy: function (options) {
                if (options.error && options.error.code === 'ECONNREFUSED') {
                    // End reconnecting on a specific error and flush all commands with a individual
                    // error
                    ErrorConsole('DBpool Message', __filename, `${options.error}`);
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
        const connectFunc = () => {
            const redis = Redis.createClient(Object.assign({}, options, defaultOpt));
            SuccessConsole(
                'DBpool Message',
                __filename,
                `Connected Reids (${redisConfig.host}:${redisConfig.port}) successfully to server.`
            );
            return redis;
        };
        const disconnectFunc = async (client) => {
            await client.quit();
            // await client.end(true);
            SuccessConsole(
                'DBpool Message',
                __filename,
                `Closed Reids (${redisConfig.host}:${redisConfig.port}) successfully to server.`
            );
        };

        this.redisPool = Object
            .keys(poolOptions)
            .length > 0
                ? new DBpool(connectFunc, disconnectFunc, poolOptions)
                : new DBpool(connectFunc, disconnectFunc);
    }

    /**
     * @description 关闭该Redis连接池
     * @author Dizzy L
     * @memberof RedisResource
     */
    close() {
        this
            .redisPool
            .closePool();
    }

    /**
     *  Redis对执行pool执行sqlAction的再封装
     * @param {*} actionFunc
     * @returns
     * @memberof MongoResource
     */
    action(actionFunc) {
        return this
            .redisPool
            .sqlAction(actionFunc, __filename);
    }

    /**
     * @description Redis的哈希设置
     * @author Dizzy L
     * @param {string} key 要插入的哈希Key
     * @param {*} paramsObj 带插入的对象
     * @param {Number} expire 过期时间(s)
     * @memberof RedisResource
     */
    hmSet(key = "", paramsObj, expire = -1) {
        this.action(client => {
            return new Promise((resolve, reject) => {
                if (key) 
                    client
                        .HMSETAsync(key, paramsObj)
                        .then(() => {
                            if (expire !== -1) 
                                client.EXPIREAsync(key, expire);
                            resolve();
                        })
                        .catch(err => reject(err));
                }
            );
        });
    }

    /**
     * @description Redis的获取在哈希表中指定 key 的所有字段和值
     * @author Dizzy L
     * @param {string} [key=""] 需要查询的关键 key
     * @returns {Object} 指定 key 的所有字段和值
     * @memberof RedisResource
     */
    hgetAll(key = "") {
        return this.action(client => {
            return new Promise((resolve, reject) => {
                if (key) 
                    client
                        .HGETALLAsync(key)
                        .then(data => resolve(data))
                        .catch(err => reject('err', err));
                }
            );
        });
    }

    /**
     * @description Redis的获取所有keys
     * @author Dizzy L
     * @param {string} [key=""] 给定模式 pattern 的 key
     * @returns {Promise} keys的List
     * @memberof RedisResource
     */
    keys(pattern = "*") {
        return this.action(client => {
            return new Promise((resolve, reject) => {
                client
                    .KEYSAsync(pattern)
                    .then(data => resolve(data))
                    .catch(err => reject('err', err));
            })
        });
    }

    /**
     * @description Redis的清空所有键值
     * @author Dizzy L
     * @returns {Promise}
     * @memberof RedisResource
     */
    flushall() {
        return this.action(client => {
            return client.FLUSHALLAsync();
        });
    }
}

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