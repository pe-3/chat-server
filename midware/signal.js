// map 必须全局唯一
const map = new Map();
function signal(req, res, next) {
    req.signal = map;
    // map 用来通信
    next();
}

module.exports = signal;