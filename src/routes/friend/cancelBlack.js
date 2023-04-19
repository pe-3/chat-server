/**
 * 取消拉黑
 */

const {
    queryFriend,
    cancelBlack
} = require('../../mysql/friend');

const { getIdByUsername } = require('../../mysql/user');

module.exports = {
    auth: true,
    async get(req, res) {
        const { id } = req.user;
        const { friend } = req.query;

        const [{ id: friend_id }] = await getIdByUsername(friend);
        // 查询是否拉黑
        const relation = await queryFriend(id, friend_id);
        if (relation[0].status !== 3) {
            return res.fail('没有拉黑');
        }
        // 取消拉黑
        const result = await cancelBlack(id, friend_id);
        if (result.affectedRows !== 1) {
            return res.fail('出了点小差错，稍后再试');
        }
        res.success('取消拉黑成功');
    }
}