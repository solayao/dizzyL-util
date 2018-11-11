const genericPool = require('generic-pool');
const emptyFunc = require('fbjs/lib/emptyFunction');
const { ErrorConsole, SuccessConsole } = require('../log/ChalkConsole');
/**
 * @description 数据库连接池
 * @git https://github.com/coopernurse/node-pool
 * @author Dizzy L
 * @class DBPool
 */
class DBPool {
    /**
     * Creates an instance of DBPool.
     * @author Dizzy L
     * @param {function} [connectFunc=emptyFunc] a function that the pool will call when it wants a new resource. It should return a Promise that either resolves to a resource or rejects to an Error if it is unable to create a resource for whatever reason.
     * @param {(client) => emptyFunc} [disconnectFunc] a function that the pool will call when it wants to destroy a resource. It should accept one argument resource where resource is whatever factory.create made. The destroy function should return a Promise that resolves once it has destroyed the resource.
     * @param {any} [opts={max: 10, min: 2}] 连接池配置项
     * @memberof DBPool
     */
    constructor(connectFunc = emptyFunc, disconnectFunc = (client) => emptyFunc(), opts = { max: 20, min: 2 }) {
        const factory = {
            create: connectFunc,
            destroy: (client) => disconnectFunc(client),
        }
        this.pool = genericPool.createPool(factory, opts);

        process.on('unhandledRejection', (reason, promise) => {
            ErrorConsole('Unhandled Rejection At: Promise ', 'DBpool', JSON.stringify({reason, promise}));
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
    sqlAction(actionFunc = (dbClient) => emptyFunc(), filename = __filename) {
        return this.pool.use(dbClient => actionFunc(dbClient).catch(err => { throw err; }))
            .then(result => {
                SuccessConsole('DBpool Message', filename, `Release 1 connection, pool.size is ${this.pool.size}, pool.available is ${this.pool.available}`);
                return result;    
            })
            .catch(err => {
                ErrorConsole('SQLAction Error', filename, JSON.stringify(err));
                SuccessConsole('DBpool Message', filename, `Destroy 1 connection, pool.size is ${this.pool.size}, pool.available is ${this.pool.available}`);
            });
    }

    /**
     * @description 关闭连接池
     * @author Dizzy L
     * @memberof DBPool
     */
    closePool() {
        this.pool.drain()
            .then(() => {
                this.pool.clear();
                // SuccessConsole('Close DBpool Message', __filename, 'Successful!');
            });
    }
}

module.exports = DBPool;