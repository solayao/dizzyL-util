// const HCCrawler = require('headless-chrome-crawler');
// const { SuccessConsole, ErrorConsole, WarningConsole } = require('../log/ChalkConsole');

// function getEmptyFunc() {
//     return (() => {});
// }
// /**
//  * @description 对Headless-chrome-crawler的封装模块
//  * @url https://github.com/yujiosaka/headless-chrome-crawler/blob/master/docs/API.md
//  * @author Dizzy L
//  * @class DizzyHcCrawler
//  */
// class DizzyHcCrawler {
//     /**
//      *Creates an instance of DizzyHcCrawler.
//      * @description crawler实例适用于react, vue, angular和js动态渲染的页面爬取
//      * @author Dizzy L
//      * @memberof DizzyHcCrawler
//      */
//     constructor() {
//         this.crawler = null;
        
//         process.on('unhandledRejection', (error, p) => {
//             // Will print "unhandledRejection err is not defined"
//             WarningConsole('UnhandledRejection', __filename, JSON.stringify({p: error}));
//             console.log(p);
//         });
//     }

//     /**
//      * @description 获取HC实例
//      * @author Dizzy L
//      * @memberof DizzyHcCrawler
//      * @returns HC实例 || null
//      */
//     getCrawler () {
//         return this.crawler;
//     }

//     /**
//      * @description HC 初始化配置
//      * @author Dizzy L
//      * @param {*} { evaluatePage = {}, onSuccessCB = (rst) => {}, onErrorCB = () => {}, onRetried = () => {}  }
//      * @memberof DizzyHcCrawler
//      */
//     async create({ evaluatePage = {}, onSuccessCB = getEmptyFunc, onErrorCB = getEmptyFunc, onRetriedCB = getEmptyFunc }) {
//         this.crawler = await HCCrawler.launch({
//             evaluatePage: evaluatePage,
//             onSuccess: (rst => { // rst 成功结果， rst.result 为对应evaluatePage捕捉到的结果对象
//                 onSuccessCB(rst);
//                 SuccessConsole('Crawler Catch HTML', __filename, `[GET ${rst.response.status}] \n\t${rst.response.url}`);
//             }),
//         });

//         this.crawler.on('requeststarted', (options) => {
//             SuccessConsole('Crawler Catch HTML', __filename, `[HC START] \n\t${options.url}`);
//         });
//         this.crawler.on('requestskipped', (options) => {
//             SuccessConsole('Crawler Catch HTML', __filename, `[HC SKIP TO] \n\t${options.url}`);
//         });
//         this.crawler.on('requestfinished', (options) => {
//             SuccessConsole('Crawler Catch HTML', __filename, `[HC FINISH] \n\t${options.url}`);
//         });
//         this.crawler.on('disconnected', () => {
//             SuccessConsole('Crawler Catch HTML', __filename, '[HC DISCONNECTED] successful');
//         });
//         this.crawler.on('requestretried', (options) => {
//             WarningConsole('Crawler Catch HTML', __filename, `[HC RETRIED] \n\t${options.url}\n\t${JSON.stringify(options)}`);
//             onRetriedCB();
//         });
//         this.crawler.on('requestfailed', (err) => {
//             ErrorConsole('Crawler Catch Error', __filename, `[HC FAILED] \n\t${JSON.stringify(err)}`);
//           	onErrorCB();
//         });
//     }

//     /**
//      * @description 将任务加入队列，并等待执行
//      * @author Dizzy L
//      * @param {String|Array|Object} uri 爬取的地址任务
//      * @memberof DizzyHcCrawler
//      */
//     async queue(uri) {
//         if (this.crawler) {
//             await this.crawler.queue(uri);
//         }
//     }

//     /**
//      * @description 关闭HC
//      * @author Dizzy L
//      * @memberof DizzyHcCrawler
//      */
//     async close(){
//         if (this.crawler) {
//             await this.crawler.onIdle();
//             await this.crawler.close();
//         }
//     }
// }

// module.exports =  DizzyHcCrawler;
