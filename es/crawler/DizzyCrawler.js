const Crawler = require('crawler');
const seenreq = require('seenreq');
const { SuccessConsole, ErrorConsole, WarningConsole } = require('../log/ChalkConsole');
const { imgReg } = require('./PublicReg');


/**
 * @description 对Node-Crawler的封装模块
 * @author Dizzy L
 * @export
 * @class DizzyCrawler
 */
class DizzyCrawler {
    /**
     *Creates an instance of DizzyCrawler.
     * @description crawler实例适用于非react, vue, angular渲染的页面爬取
     * @author Dizzy L
     * @param {*} [options={}]  node-crawler配置
     * @memberof DizzyCrawler
     */
    constructor(options = {}) {
        const defaultOptions = {
            maxConnections: 20,
            callback: function (error, res, done) {
                let $ = res.$;
                if (error) {
                    ErrorConsole('Crawler catch', __filename, error);
                } else {
                    SuccessConsole('Crawler catch', __filename, `[${res.request.method} ${res.statusCode}] \n\t${res.request.uri.href}`)
                }
                done();
            },
        };
        this.crawler = new Crawler(Object.assign({}, defaultOptions, options));
        this.seen = new seenreq();

        process.on('unhandledRejection', (error, p) => {
            // Will print "unhandledRejection err is not defined"
            WarningConsole('UnhandledRejection', __filename);
            console.log(p);
        });
    }

    /**
     * @description 获取C实例
     * @author Dizzy L
     * @memberof DizzyCrawler
     * @returns C实例 || null
     */
    getCrawler () {
        return this.crawler;
    }

    /**
     * @description 获取实例中的seenreq实例
     * @author Dizzy L
     * @example https://github.com/mike442144/seenreq/blob/1.0.0/README.md
     * @returns this.seen
     * @memberof DizzyCrawler
     */
    getSeen() {
        return this.seen;
    }

    /**
     * @description 将任务加入队列，并等待其被执行。 【同步callback】
     * @author Dizzy L
     * @param {Object|Array} options node-crawler queue的options变量
     * @memberof DizzyCrawler
     */
    queue(options) {
        this.crawler.queue(options);
    }

    /**
     * @description 将任务加入队列，并等待其被执行。 【异步callback】
     * @author Dizzy L
     * @param {Object|Array} options node-crawler queue的options变量
     * @param {function(res)} cb 通用的异步处理callback方法
     * @memberof DizzyCrawler
     * @return {Promise} Promise
     */
    promiseQueue(options, cb) {
        if (!Array.isArray(options)) {
            /** 
             * @description options是单个对象
             * @return {Promise} resolve() / reject({ options })
             */
            let catchUri = typeof options === 'string' ? options : options.uri;
            const isImage = imgReg.test(catchUri);

            return new Promise((resolve, reject) => {
                try {
                    const callback = async (error, res, done) => {
                        if (error) throw (error);
                        /** 基础的控制台信息 */
                        const baseTitle = `Crawler Catch ${isImage ? 'IMAGE' : 'HTML'}`;
                        const baseMess = `[${res.request.method} ${res.statusCode}] \n\t${catchUri}`;
                        if (res.statusCode === 200) {
                            /** 执行成功的地址注册seenreq做缓存处理 */
                            await this.seen.exists(options, (err, rst) => {
                                if (err) throw err;
                            })
                            SuccessConsole(baseTitle, __filename, baseMess);
                            /** 执行cb */
                            cb && cb(res);
                            resolve();
                        }
                        else if ([403, 404].includes(res.statusCode)) {
                            let msg = "";
                            switch (res.statusCode) {
                                case 403: msg = `\n\tSorry, You don't have permission to access the URL(${catchUri}) on this server!`; break;
                                case 404: msg = `\n\tSorry, the URL(${catchUri}) is missing in the web! ${new Date().valueOf()}`; break;
                                default: msg = '\n\tCrawler catch error.';
                            }
                            ErrorConsole(baseTitle, __filename, `${baseMess}${msg}`);
                            reject({ options });
                        }
                        else WarningConsole(baseTitle, __filename, `未收录状态: ${res.statusCode}`);
                        /** 处理结束之后必须调用此函数 */
                        done();
                    };
                    /** Crawler队列配置 */
                    const configs = Object.assign(
                        typeof options === 'object' ? { ...options, callback } : { uri: options, callback },
                        isImage ? { encoding: null, jQuery: false } : {},
                    );
                    this.crawler.queue(configs);
                } catch (err) {
                    ErrorConsole('During Crawler', __filename, 'Crawler在执行callback时发生了错误！');
                    reject(err);
                }
            }).catch(rejectError => {
                /** 把reject异常解除掉，并返回异常的options, 在并发处理数组时有用 */
                return rejectError.options;
            });
        } else {
            /** options是对象数组*/
            return new Promise(async (resolve, reject) => {
                let errOptions = [], optList = options;
                /**
                 * @description 批量执行（递归）
                 * @param {Array} optList 
                 * @returns {Promise}
                 */
                const groupRun = (optList) => {
                    return Promise.all(optList.map(o => this.promiseQueue(o, cb)))
                        .then(result => {
                            errOptions = result.filter(v => v);
                            if (errOptions.length > 0) {
                                const errorMsg = `${errOptions.map((v, i) => `${i ? '\n\t' : ''}"${v.uri}"`)}`;
                                ErrorConsole('Group Error Crawler', __filename, errorMsg)
                            };
                            return;
                        })
                        .catch(err => {
                            reject(err);
                            // if (err.hasOwnProperty('options')) {
                            //     const spliceIndex = optList.map(o => JSON.stringify(o)).findIndex(o => o === JSON.stringify(err.options));
                            //     errOptions.push(optList[spliceIndex]);
                            //     optList.splice(spliceIndex, 1);
                            //     /** 借助seenreq达到排除已爬过的链接 */
                            //     this.seen.exists(optList, async (e, rst) => {
                            //         rst.forEach((v, i) => v && delete optList[i])
                            //         const newOptList = optList.filter(o => o);
                            //         await groupRun(newOptList);
                            //     });
                            // }
                            // else {
                            //     reject(err);
                            // }
                        });
                }

                await groupRun(optList);
                resolve();
            });
        }
    }
}

module.exports = DizzyCrawler;