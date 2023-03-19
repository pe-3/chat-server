/**
 * 邮件路由
 */
const { generateCode } = require('../../utils');

function validateEmail(mail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(mail);
}

module.exports = {
    post(req, res) {
        const { mail } = req.body;
        /**
         * 验证邮箱是否合法
         */
        if (!mail || !validateEmail(mail)) {
            return res.fail('邮箱为空或不合法');
        }

        /**
         * 生成验证码并发送
         */
        const code = generateCode();
        console.log({ mail, code });

        /**
         * 哈希缓存验证码
         */
        req.signal.set(mail, code);

        /**
         * 响应成功
         */
        res.success('验证码发送成功');        
    }
}