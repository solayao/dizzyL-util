const Redis = require('redis');
const bluebird = require('bluebird');
const emptyFunc = require('fbjs/lib/emptyFunction');
bluebird.promisifyAll(Redis);

const DBpool = require('./DBpool');
const {redisConfig} = require('./config.json');
const {SuccessConsole, ErrorConsole} = require('../log/ChalkConsole');
// const getLogger = require('../log/log4js');
const {isNotEmpty} = require('../type');

const getOpt = (message) => ({
    title: 'DBpool message',
    pathName: __filename,
    message,
});

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
                if (options.error && options.error.code === 'ETIMEDOUT') {
                    let opt = getOpt(`Connected MongoDB (${options.error.address}:${options.error.port}) NOT successfully to server!`);
                    ErrorConsole(opt);
                    opt = null;
                }
                if (options.error && options.error.code === 'ECONNREFUSED') {
                    // End reconnecting on a specific error and flush all commands with a individual
                    // error
                    let opt = getOpt(`${options.error}`);
                    ErrorConsole(opt);
                    opt = null;
                    return new Error('The server refused the connection');
                }
                if (options.total_retry_time > 1000 * 60 * 60) {
                    // End reconnecting after a specific timeout and flush all commands with a
                    // individual error
                    let opt = getOpt('Retry time exhausted');
                    ErrorConsole(opt);
                    opt = null;
                    return new Error('Retry time exhausted');
                }
                if (options.attempt > 10) {
                    // End reconnecting with built in error
                    let opt = getOpt('End reconnecting!');
                    ErrorConsole(opt);
                    opt = null;
                    return undefined;
                }
                // reconnect after
                return Math.min(options.attempt * 100, 3000);
            }
        };
        const connectFunc = () => {
            const redis = Redis.createClient(Object.assign({}, options, defaultOpt));
            redis.on("connect", function () {
                let opt = getOpt(`Connected Reids (${options.host}:${options.port}) successfully to server.`);
                SuccessConsole(opt);
                opt = null;
            });
            return redis;
        };
        const disconnectFunc = async (client) => {
            await client.quit();
            let opt = getOpt(`Closed Reids (${options.host}:${options.port}) successfully to server.`);
            SuccessConsole(opt);
            opt = null;
        };

        this.redisPool = isNotEmpty(poolOptions) ? new DBpool(connectFunc, disconnectFunc, poolOptions)
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
     * @description 关闭该Redis连接池
     * @author Dizzy L
     * @memberof RedisResource
     */
    close() {
        this.redisPool.closePool();
    }

    /**
     *  Redis对执行pool执行sqlAction的再封装
     * @param {*} actionFunc
     * @returns
     * @memberof MongoResource
     */
    action(actionFunc) {
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
    lPush(key = "", arr = [], expire = -1) {
        if (!isNotEmpty(arr)) return [];

        return this.action(client => client.LPUSHAsync(key, ...arr)
            .then(data => {
                if (expire !== -1) 
                    client.EXPIREAsync(key, expire);
                return data;
            })
        )
    }

    /**
     * @description Redis的lrange操作
     * @author Dizzy L
     * @param {string} key 需要查询的关键 key
     * @param {array} length 要查询的开始和结束index数组, 默认[0, -1]查询key的结果的所有长度
     * @memberof RedisResource
     */
    lRange(key = "", length = [0, -1]) {
        return this.action(client => client.LRANGEAsync(key, ...length))
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
        if (!isNotEmpty(paramsObj)) return null;

        return this.action(client => {
            return new Promise((resolve, reject) => {
                if (key) {
                    client
                        .HMSETAsync(key, paramsObj)
                        .then(() => {
                            if (expire !== -1) 
                                client.EXPIREAsync(key, expire);
                            resolve();
                        })
                        .catch(err => reject(err));
                } else {
                    resolve();
                }
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
    hgetAll(key = "") {
        return this.action(client => client.HGETALLAsync(key));
    }

    /**
     * @description Redis的获取所有keys
     * @author Dizzy L
     * @param {string} [key=""] 给定模式 pattern 的 key
     * @returns {Promise} keys的List
     * @memberof RedisResource
     */
    keys(pattern = "*") {
        return this.action(client => client.KEYSAsync(pattern));
    }

    /**
     * @description Redis的清空所有键值
     * @author Dizzy L
     * @returns {Promise}
     * @memberof RedisResource
     */
    flushall() {
        return this.action(client => client.FLUSHALLAsync());
    }

    /**
     * 获取mongo实例自行编写方法
     * @param {Promise} [promiseFunc=(client) =>　{}] client实例将要执行的方法
     * @returns
     * @memberof RedisResource
     */
    actionForClient(promiseFunc = emptyFunc) {
        return this.action(client => Promise.resolve(promiseFunc(client)))
    }
}

module.exports = RedisResource;

// (async() => {
    // const r = new RedisResource();     await r.hmSet('test', {         param1:
    // 'test1',         param2: 'test2'     });     const r2 = new RedisResource();
    // await r2.hmSet('test3', {         param1: 'test1',         param2: 'test2'
    // });     await     r.hmSet('test2', {         param1: 'test1',         param2:
    // 'test2'     });     await     r.close();     await r2.hmSet('test4', {
    // param1: 'test1',         param2: 'test2'     });     await r.hmSet('2015-1',
    // {         param1: 'test1',         param2: 'test2'     });     await
    // r.hmSet('2016-1', {         param1: 'test1',         param2: 'test2'     });
    // await     r.hmSet('2016-4', {         param1: 'test1',         param2:
    // 'test2'     }, 10000);     await     r.hmSet('2016-5', {         param1:
    // 'test1',         param2: 'test2'     });     await     r.flushall();     let
    // fir = await     r.hgetAll(test[0]);     process.env.NODE_ENV = 'production';
    // let opt = getOpt(await r.lRange('banzhuan_OneDay'));     WarningConsole(opt);
    // getLogger(false).warn(opt.message)     opt = null;     r.close(); })();