module.exports = {
    auth: true,
    async get(req, res) {
        const { friend } = req.query;
        const { id } = req.user;
        // 查询朋友 id
        const [{ id: friend_id }] = await getIdByUsername(friend);

        // 查询是否为好友
        const relation = await queryFriend(id, friend_id);
        const relation1 = await queryFriend(friend_id, id);
        if (!relation.length || !relation1.length) {
            return res.fail('还不是好友，无法拉黑');
        }

        // 拉黑
        const result = await blackFriend(id, friend_id);
        if (result.affectedRows !== 1) {
            return res.fail('出了点小差错，稍后再试');
        }
        res.success('拉黑成功');
    }
}