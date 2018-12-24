const log4js = require('log4js');
const isPro = process.env.NODE_ENV === 'production';

const getLogger = (isDev = !isPro) => {
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
            },
            crud: {
                type: 'dateFile',
                filename: 'logFiles/',
                pattern: 'yyyy-MM-dd.crud.log',
                alwaysIncludePattern: true,
                daysToKeep: 30,
            },
            justErrors: {
                type: 'dateFile',
                filename: 'logFiles/',
                pattern: 'yyyy-MM-dd.error.log',
                alwaysIncludePattern: true,
                daysToKeep: 30,
            },
            filterError: {
                type: 'logLevelFilter',
                level: 'error',
                appender: 'justErrors'
            },
            filterWarn: {
                type: 'logLevelFilter',
                level: 'warn',
                appender: 'crud'
            },
        },
        categories: {
            default: {
                appenders: ['console', 'dev', 'filterError'], level: 'debug'
            },
            crud: {
                appenders: ['stdout', 'filterWarn', 'filterError'], level: 'debug'
            }
        }
    });
    return log4js.getLogger(isDev ? 'default' : 'crud');
}

module.exports = getLogger;
