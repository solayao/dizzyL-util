const Mongo = require('./MongoResource');
const Redis = require('./RedisResource');
const { jsToDB, dbToJs } = require('./Mapper');

module.exports = {
    Mongo,
    Redis,
    jsToDB,
    dbToJs,
};
