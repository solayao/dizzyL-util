const HCCrawler = require('headless-chrome-crawler');
const { SuccessConsole, ErrorConsole, WarningConsole } = require('../log/ChalkConsole');

/**
 * @description 对Headless-chrome-crawler的封装模块
 * @author Dizzy L
 * @class DizzyHcCrawler
 */
class DizzyHcCrawler {
    /**
     *Creates an instance of DizzyHcCrawler.
     * @description crawler实例适用于react, vue, angular和js动态渲染的页面爬取
     * @author Dizzy L
     * @memberof DizzyHcCrawler
     */
    constructor() {
        this.crawler = null;
        
        process.on('unhandledRejection', (error, p) => {
            // Will print "unhandledRejection err is not defined"
            WarningConsole('UnhandledRejection', 'DizzyHcCrawler');
            console.log(p);
        });
    }

    /**
     * @description
     * @author Dizzy L
     * @param {*} { evaluatePage = {}, onSuccessCB = (rst) => {} }
     * @memberof DizzyHcCrawler
     */
    async create({ evaluatePage = (() => ({})), onSuccessCB = (rst) => {}, onErrorCB = () => {} }) {
        this.crawler = await HCCrawler.launch({
            // Function to be evaluated in browsers
            evaluatePage: evaluatePage,
            // Function to be called with evaluated results from browsers
            onSuccess: (rst => {
                onSuccessCB(rst);
                SuccessConsole('Crawler Catch HTML', __filename, `[GET ${rst.response.status}] \n\t${rst.response.url}\n\t${JSON.stringify(options)}`);
            }),
        });
        this.crawler.on('requeststarted', (options) => {
            SuccessConsole('Crawler Catch HTML', __filename, `[HC START] \n\t${options.url}`);
        });
        this.crawler.on('requestskipped', (options) => {
            SuccessConsole('Crawler Catch HTML', __filename, `[HC SKIP TO] \n\t${options.url}`);
        });
        this.crawler.on('requestfinished', (options) => {
            SuccessConsole('Crawler Catch HTML', __filename, `[HC FINISH] \n\t${options.url}`);
        });
        this.crawler.on('requestretried', (options) => {
            WarningConsole('Crawler Catch HTML', __filename, `[HC RETRIED] \n\t${options.url}`);
        });
        this.crawler.on('requestfailed', (err) => {
            console.log(err)
            ErrorConsole('Crawler Catch Error', __filename, `[HC FAILED] \n\t${JSON.stringify(err)}`);
          	onErrorCB();
        });
        this.crawler.on('maxdepthreached', () => {
            SuccessConsole('Crawler Catch HTML', __filename, '[HC MAXDEPTHREACHED] maxdepthreached');
        });
        this.crawler.on('disconnected', () => {
            SuccessConsole('Crawler Catch HTML', __filename, '[HC DISCONNECTED] successful');
        });
    }

    /**
     * @description 将任务加入队列，并等待执行
     * @author Dizzy L
     * @param {String|Array|Object} uri 爬取的地址任务
     * @memberof DizzyHcCrawler
     */
    async queue(uri) {
        await this.crawler.queue(uri);
    }

    async close(){
        await this.crawler.onIdle();
        await this.crawler.close();
    }
}

module.exports =  DizzyHcCrawler;
