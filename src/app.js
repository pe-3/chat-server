/**
 * techat 应用启动文件
 */
// 引入依赖包
const express = require('express');
const { join } = require('path');
const createError = require('http-errors');
const logger = require('morgan');

// 引入中间件
const signal = require('./midware/signal');
const cors = require('cors');
const delay = require('./midware/delay');
const { authenticateToken } = require('./midware/auth');
const res = require('./midware/res');
const Socket = require('./socket');

// 引入工具
const getModules = require('./utils/getModules');

// 引入配置
const { ALLOW_METHODS } = require('./config');

/**
 * 生成 express 应用主体
 */
const app = express();

/**
 * 设置相关中间件
 */
app.use(express.json()); // 解析 JSON 数据
app.use('/static', express.static(join(__dirname, '../public'))); // 暴露静态文件
app.use(cors()); // 允许跨域
app.use(delay(1000)); // 设置响应延迟
app.use(logger('dev')); // 开发日志
app.use(signal); // 信号
app.use(res); // 接口返回标准

/**
 * 获取所有暴露的路由
 */
const dirPath = join(__dirname, './routes');
const routes = getModules(dirPath);

/**
 * 注册所有路由
 */
routes.forEach(route => {
    const { path, module } = route;
    const router = express.Router();

    ALLOW_METHODS.forEach((method) => {
        if (!module[method]) return;
        /**
         * 通过 module.midwares 设置中间件
         * 通过 module.auth 设置是否需要鉴权
         */
        const midwares = module.midwares ?? [];
        module.auth && midwares.unshift(authenticateToken);

        /**
         * 通过 module[method] 设置相应请求方式的处理器
         */
        const routeHandler = async function (req, res, next) {
            try {
                await module[method](req, res, next);
            } catch (error) {
                next(error);
            }
        };
        router[method](path, midwares, routeHandler);
    });

    app.use(router);
});

/**
 * 处理错误路由
 */
app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

/**
 * 
 */
new Socket();

module.exports = app;