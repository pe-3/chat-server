const pw = function (func) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            func(...args, (err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        })
    }
};

module.exports = pw;