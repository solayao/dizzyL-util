# dizzy L漫画网爬虫项目
* 基于[node-crawler](https://github.com/bda-research/node-crawler)开发
* 采用mongodb存储数据，redis做最新更新数据
---
# 目录结构
```
dizzy_crawler/
  crawlers/
    yyls/
      all.js  所有资源的爬取存储
      updates.js  更新资源的爬取
    demo.js  测试模板
  dbs/
    DBpool.js  数据库连接池抽象类
    MongoResource.js  MongoDB类
    RedisResource.js  Redis类
  log/  log4js配置文件夹
  logs/   log4js输出文件夹
  node_modules/
  README.md
```
|