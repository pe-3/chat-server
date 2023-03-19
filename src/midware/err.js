function errorHandler(err, req, res, next) {
    // 控制台打印错误
    console.error(err.stack);

    // 响应错误
    res.status(500).send({
        message: '服务器内部错误',
        error: err.message
    });
}