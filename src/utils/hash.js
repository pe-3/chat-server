const crypto = require('crypto');

async function getHashByUnit8Array(unit8Array) {
    // 创建一个 sha256 哈希对象
    const hash = crypto.createHash('sha256');

    // 输入要哈希的数据，这里假设您的 Uint8Array 名称为 uint8Array
    hash.update(unit8Array);

    // 计算哈希摘要，并以十六进制字符串的形式输出
    const digest = hash.digest('hex');

    return digest;
}

exports.getHashByUnit8Array = getHashByUnit8Array;

function getHashByBuffer(buffer) {
    // 创建哈希对象
    const hash = crypto.createHash('sha256');

    // 更新哈希对象的输入数据
    hash.update(buffer);

    // 计算并返回哈希值
    return hash.digest('hex');
}

exports.getHashByBuffer = getHashByBuffer