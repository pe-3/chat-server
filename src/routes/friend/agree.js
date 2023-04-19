/**
 * 同意好友申请
 */
const {
    queryFriend,
    agreeFriend
} = require('../../mysql/friend');

const {
    getIdByUsername
} = require('../../mysql/user');

module.exports = {
    auth: true,
    async get(req, res) {
        try {
            // 获取用户 ID 和好友 id
            const { id } = req.user;
            const { friend } = req.query;
            const data = await getIdByUsername(friend);
            if (!data.length) {
                return res.fail('查无此人');
            }
            const [{ id: friend_id }] = data;

            // 验证是否有申请
            const relation = await queryFriend(friend_id, id);
            if (!relation.length) {
                return res.fail('暂无好友申请');
            }

            // 验证是否已经申请过
            const relation1 = await queryFriend(id, friend_id);
            if (relation1.length) {
                if (relation1[0].status === 1) {
                    return res.fail('已经同意过好友');
                }
            }

            // 发起同意好友
            const result = await agreeFriend(id, friend_id);
            if (result[0].affectedRows !== 1 || result[1].affectedRows !== 1) {
                return res.fail('同意失败，请稍后再试');
            }
            return res.success('同意成功');
        } catch (error) {
            console.warn(error);
        }
    }
}