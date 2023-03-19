/**
 * 好友申请列表
 */
const { FRIEND_STATUS_AGREED } = require('../../config');
const { getAgreeList } = require('../../mysql/friend');
const { getUsersByIds, userInfoFilter } = require('../../mysql/user');

module.exports = {
    auth: true,
    async get(req, res) {
        try {
            const { id } = req.user;
            let idList = await getAgreeList(id);
            idList = idList.map(data => data.user_id);

            if (!idList.length) {
                return res.fail('还没有好友申请');
            }
            
            let agreeList = await getUsersByIds(idList);
            agreeList = userInfoFilter(...agreeList);

            res.success('查询成功', { agreeList });
        } catch (error) {
            console.error(error);
        }
    }
}