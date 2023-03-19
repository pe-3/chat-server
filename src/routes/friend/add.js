/**
 * 添加好友
 */
const {
    getIdByUsername
} = require('../../mysql/user');

const {
    queryFriend,
    addFriend,
    recoveryFriend
} = require('../../mysql/friend');

const {
    FRIEND_STATUS_WAIT,
    FRIEND_STATUS_AGREED,
    FRIEND_STATUS_DEL,
    FRIEND_STATUS_BLACKED
} = require('../../config');

module.exports = {
    auth: true,
    async get(req, res) {
        // 拿到用户 id
        const { id } = req.user;

        // 拿到要添加的账号 ID
        const { friend } = req.query;
        const data = await getIdByUsername(friend);

        if (!data.length) {
            return res.fail('查无此人');
        }

        const [{ id: friend_id }] = data;
        if (!friend_id) {
            return res.fail('无法添加该账户');
        }

        // 查询是否存在该关系
        const row = await queryFriend(id, friend_id);

        if (row.length) {
            const [{ status }] = row;
            if (!status) {
                return res.fail('添加失败，请稍后再试');
            }
            else if (status === FRIEND_STATUS_WAIT) {
                return res.fail('你已添加过这位好友了，请等待其同意');
            }
            else if (status === FRIEND_STATUS_AGREED) {
                return res.fail('已经是好友了，无需再添加');
            }
            else if (status === FRIEND_STATUS_DEL || status === FRIEND_STATUS_BLACKED) {
                const res = await recoveryFriend(id, friend_id);
                if (res.affectedRows === 1) {
                    return res.success('好友申请发送成功');
                }
            }
        }
        else {
            // 添加好友
            const result = await addFriend(id, friend_id);
            if (result.affectedRows === 1) {
                return res.success('好友申请发送成功');
            }
        }
        return res.fail('添加失败，请稍后再试');
    }
}