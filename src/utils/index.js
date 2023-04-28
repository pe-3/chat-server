/**
 * 用来生产随机验证码
 * @param {number} codeLen 随机验证码位数 
 * @returns {string} 默认返回六位数验证码
 */
function generateCode(codeLen = 6) {
    const chars = '0123456789';
    let code = '';
    for (let i = 0; i < codeLen; i++) {
        const index = Math.floor(Math.random() * 10);
        code += chars[index];
    }
    return code;
}

exports.generateCode = generateCode;

/**
 * 
 * @param {string} mail 输入邮箱地址
 * @returns {boolean} 输入邮箱格式是否合法
 */
function validateEmail(mail) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
}

exports.validateEmail = validateEmail;