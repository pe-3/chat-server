/**
 * 查找用户
 */

const { getUserByUsername, userInfoFilter } = require("../../mysql/user");

module.exports = {
    auth: true,
    async get(req, res) {
        try {
            const { username } = req.query;

            const [user] = await getUserByUsername(username);

            if (!user) {
                res.fail('查无此人');
            }
            /**
             *  过滤数据
             */
            const users = userInfoFilter(user);

            if (!users.length) {
                res.fail('查无此人');
            }

            const userinfo = users[0];

            res.success('查找到了', { userinfo });
        } catch (error) {
            console.error(error);
        }
    }
}