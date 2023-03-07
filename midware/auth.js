const jwt = require('jsonwebtoken');
const JWT_SECRET = '^&$^&*$*(#)';
const expiresIn = '7d';
const express = require('express');

const getToken = function (data) {
    return jwt.sign(data, JWT_SECRET, { expiresIn });
}

const authenticateToken = (req, res, next) => {
    // 从请求头中获取令牌
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // 令牌不存在，返回 HTTP 401 Unauthorized 错误
    if (!token) {
        return res.status(200).send({ message: '未登录或者登录过期，请重新登录' });
    }

    // 验证令牌
    jwt.verify(token, JWT_SECRET, (err, user) => {
        // 令牌无效，登录过期， 返回 401 未认证
        if (err) {
            return res.status(200).send({
                message: '未登录或者登录过期，请重新登录'
            });
        }
        // 有效则将解码的对象添加到请求对象中
        req.user = user;
        next();
    });
}

const authRouter = express.Router();
authRouter.use(authenticateToken);
module.exports = {
    getToken,
    authenticateToken,
    authRouter
}