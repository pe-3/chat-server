/**
 * 邮件路由
 */
const { generateCode, validateEmail } = require('../../utils');

module.exports = {
    post(req, res) {
        try {
            const { mail } = req.body;
            // 0. 验证邮箱是否合法
            if (!mail || !validateEmail(mail)) {
                return res.fail('邮箱为空或不合法');
            }

            // 0.1 验证是否有验证码已经发送过，但是没有使用
            if (req.signal.has(mail)) {
                return res.fail('验证码已发送，请勿重复请求');
            }

            // 1. 生成验证码
            const code = generateCode();

            // 2. 发送验证码
            console.log({ mail, code });

            // 3. 缓存验证码，留待后续验证 TODO: 用 redis
            req.signal.set(mail, code);

            // 4. 响应成功
            res.success('验证码发送成功，请注意查收');
        } catch (error) {
            console.log(error);
        }
    }
}