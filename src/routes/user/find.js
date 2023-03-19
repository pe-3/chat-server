/**
 * 查找用户
 */

const { getUserByUsername, userInfoFilter } = require("../../mysql/user");

module.exports = {
    auth: true,
    async get(req, res) {
        const { username } = req.query;

        const [user] = await getUserByUsername(username);

        if (!user) {
            res.fail('查无此人');
        }
        
        /**
         *  过滤数据
         */
        const [userinfo] = userInfoFilter(user);

        res.success('查找到了', { userinfo });
    }
}