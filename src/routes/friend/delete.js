/**
 * 删除好友
 */
const { getIdByUsername } = require('../../mysql/user');
const { queryFriend } = require('../../mysql/friend');
const { FRIEND_STATUS_BLACKED } = require('../../config');

module.exports = {
    auth: true,
    async get(req, res) {
        const { id } = req.user;
        const { friend } = req.query;

        const [{ id: friend_id }] = await getIdByUsername(friend);
        // 查询是否为好友
        const relation = await queryFriend(id, friend_id);
        const relation1 = await queryFriend(friend_id, id);
        if (!relation.length || !relation1.length) {
            return res.fail('还不是好友，无法删除');
        }

        // 查询是否被拉黑
        if (relation[0].status === FRIEND_STATUS_BLACKED) {
            return res.fail('拉黑了无法删除');
        }

        // 删除
        const result = await delFriend(id, friend_id);
        const result1 = await delFriend(friend_id, id);
        if (result.affectedRows !== 1 || result1.affectedRows !== 1) {
            return res.fail('出了点小差错，稍后再试');
        }
        res.success('删除成功');
    }
}