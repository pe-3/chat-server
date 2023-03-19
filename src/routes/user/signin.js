/**
 * 用户登录
 */
const { createToken } = require('../../midware/auth');
const { getUserByUsername } = require('../../mysql/user');
const bcrypt = require('bcrypt');

module.exports = {
    async post(req, res) {
        const {
            username,
            password
        } = req.body;

        const [user] = await getUserByUsername(username);
        
        /**
         * 检验信息合法
         */
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.fail('用户名或者密码不正确');
        }

        /**
         * 挑选载体
         */
        const payload = { id: user.id };

        /**
         * 生成 token
         */
        const token = createToken(payload);
        res.success('登录成功', { token });
    }
}