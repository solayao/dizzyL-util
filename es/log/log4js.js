const log4js = require('log4js');

const getLogger = () => {
    let isPro = !!process.env.NODE_ENV && process.env.NODE_ENV.includes('pro');
    log4js.configure({
        replaceConsole: true,
        appenders: {
            stdout: {
                type: 'stdout',
            },
            console: { 
                type: 'console'
            },
            message: {
                type: 'stdout',
                layout: {
                    type: 'messagePassThrough'
                }
            },
            dev: {
                type: 'file',
                filename: 'logFiles/development.log',
                maxLogSize:  10 * 1024 * 1024,
                backups: 2,
            },
            prod: {
                type: 'dateFile',
                filename: 'logFiles/',
                pattern: 'yyyy-MM-dd.prod.log',
                maxLogSize:  2 * 1024 * 1024,
                alwaysIncludePattern: true,
                daysToKeep: 30,
            },
            justErrors: {
                type: 'dateFile',
                filename: 'logFiles/',
                pattern: 'yyyy-MM-dd.error.log',
                maxLogSize:  2 * 1024 * 1024,
                alwaysIncludePattern: true,
                daysToKeep: 30,
            },
            filterError: {
                type: 'logLevelFilter',
                level: 'error',
                appender: 'justErrors',
            },
            filterWarn: {
                type: 'logLevelFilter',
                level: 'warn',
                appender: 'prod',
            },
        },
        categories: {
            default: {
                appenders: ['console', 'dev', 'filterError'], level: 'debug'
            },
            production: {
                appenders: ['stdout', 'filterWarn', 'filterError'], level: 'debug'
            }
        }
    });
    return log4js.getLogger(isPro ? 'production' : 'default');
}

module.exports = getLogger;