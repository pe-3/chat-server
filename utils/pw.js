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

// pw 测试

// const getId = function(id, callback) {
//     callback(null, id);
// }

// pw(getId)('123').then((id) => {
//     if(id === '123') {
//         console.log('pw测试成功');
//     }
// });