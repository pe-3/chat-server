/**
 * 获取用户个人信息
 */
const { userInfoFilter, getUserById } = require('../../mysql/user');

module.exports = {
    auth: true,
    async get(req, res) {
        try {
            /**
            * 根具用户 id 读取数据库数据
            */
            const { id } = req.user;
            let [info] = await getUserById(id);

            /**
             * 过滤数据
             */
            [info] = userInfoFilter(info);

            /**
             * 返回数据
             */
            res.success('久违了，欢迎回来', { info });
        } catch (error) {
            console.error(error);
        }
    }
}