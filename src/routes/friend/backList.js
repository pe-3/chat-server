/**
 * 获取拉黑列表
 */
const { getBlackList, userInfoFilter } = require('../../mysql/friend');
const { getUsersByIds } = require('../../mysql/user');

module.exports = {
    auth: true,
    async get(req, res) {
        const { id } = req.user;
        let idList = await getBlackList(id);
        if (!idList.length) {
            return res.fail('暂时没有拉黑的人');
        }
        idList = idList.map(data => data.friend_id);
        let blackList = await getUsersByIds(idList);
        blackList = userInfoFilter(...blackList);
        res.success('查询成功', { blackList });
    }
}