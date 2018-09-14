'use strict';

var Mongo = require('./MongoResource');
var Redis = require('./RedisResource');

module.exports = {
    Mongo: Mongo,
    Redis: Redis
};