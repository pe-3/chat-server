module.exports = (req, res, next) => {
    // 成功响应封装
    res.success = function (message, data) {
        res.send({
            success: true,
            message,
            data
        });
    }

    // 失败响应封装
    res.fail = function (message) {
        res.send({
            success: false,
            message
        });
    }

    next();
}