module.exports = (req, res, next) => {
    res.success = function (message, data) {
        res.send({
            success: true,
            message,
            data
        });
    }

    res.fail = function (message) {
        res.send({
            success: false,
            message
        });
    }

    next();
}