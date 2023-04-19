const jwt = require('jsonwebtoken');
const JWT_SECRET = '^&$^&*$*(#)';
const expiresIn = '7d';
const express = require('express');

const createToken = function (data) {
    return jwt.sign(data, JWT_SECRET, { expiresIn });
}

const verify = function (token) {
    return new Promise((resolve, reject) => {
        // 验证令牌
        jwt.verify(token, JWT_SECRET, (err, user) => {
            // 令牌无效，登录过期， 返回 401 未认证
            if (err) {
                return reject(err);
            }
            resolve(user);
        });
    })
}

const authenticateToken = (req, res, next) => {
    // 从请求头中获取令牌
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // 令牌不存在，返回 HTTP 401 Unauthorized 错误
    if (!token) {
        return res.status(200).send({ message: '未登录或者登录过期，请重新登录' });
    }

    verify(token).then(user => {
        req.user = user;
        next();
    }).catch(() => {
        res.status(200).send({ message: '未登录或者登录过期，请重新登录' });
    })
}

module.exports = {
    createToken,
    authenticateToken,
    verify
}
