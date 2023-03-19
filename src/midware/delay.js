/**
 * 延迟响应中间件
 * @param {Number} delay 
 * @returns 
 */
module.exports = function(delay) {
    return function(req, res, next) {
        if(delay === 0) {
            return next();
        }
        setTimeout(() => {
            next();
        }, delay);
    }
}