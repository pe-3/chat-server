/**
 * 获取朋友列表
 */
const {
    getFriendList
} = require('../../mysql/friend');

const {
    getUsersByIds,
    userInfoFilter
} = require('../../mysql/user');

module.exports = {
    auth: true,
    async get(req, res) {
        try {
            // 拿到用户id
            const { id } = req.user;

            // 查询数据库
            let friendIdList = await getFriendList(id);
            friendIdList = friendIdList.map(data => data.friend_id);

            // 没有好友，直接返回
            if (!friendIdList.length) {
                return res.send({ message: '你还没有添加好友' });
            }

            // 拿到朋友列表
            let friendList = await getUsersByIds(friendIdList);
            friendList = userInfoFilter(...friendList);

            // 查询朋友信息
            res.success('查询成功', { friendList });
        } catch (error) {
            console.log(error);
        }
    }
}