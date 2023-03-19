const e = require('express');
const express = require('express');
const router = express.Router();

const {
    getFriendList,
    getAddList,
    getAgreeList,
    addFriend,
    queryFriend,
    recoveryFriend,
    agreeFriend,
    blackFriend,
    cancelBlack,
    getBlackList,
    delFriend
} = require('../mysql/friend');

const {
    getUsersByIds,
    userInfoFilter,
    getIdByUsername
} = require('../mysql/user');

/**
 * 朋友列表
 */
router.get('/getlist', async function (req, res, next) {
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
        res.send({ message: '查询成功', friendList });

    } catch (error) {
        next(error);
    }
});

/**
 * 添加好友
 */
router.get('/add', async function (req, res, next) {
    try {
        // 拿到用户 id
        const { id } = req.user;

        // 拿到要添加的账号 ID
        const { friend } = req.query;
        const data = await getIdByUsername(friend);

        if (!data.length) {
            return res.send({ message: '查无此人' });
        }

        const [{ id: friend_id }] = data;
        if (!friend_id) {
            return res.send({ message: '无法添加该账户' });
        }

        // 查询是否存在该关系
        const row = await queryFriend(id, friend_id);
        if (row.length) {
            const [data] = row;
            if (data.status === 0) {
                return res.send({ message: '你已经添加过改人' });
            }
            else if (data.status === 1) {
                return res.send({ message: '已经是好友' });
            }
            else if (data.status === 2) {
                // 恢复好友
                const result = await recoveryFriend(id, friend_id);

                if (result.affectedRows !== 1) {
                    return res.send({ message: '添加失败' });
                }
                else {
                    return res.send({ message: '好友申请发送成功' });
                }
            }
            else if (data.status === 3) {
                return res.send({ message: '你已经将此人拉黑，请先解除拉黑' });
            }
            return res.send({ message: '' });
        }

        // 添加好友
        const result = await addFriend(id, friend_id);

        if (result.affectedRows !== 1) {
            return res.send({ message: '添加失败，请稍后再试' });
        }

        res.send({ message: '好友申请发送成功' });
    } catch (error) {
        next(error);
    }
});

/**
 * 添加好友列表
 */
router.get('/addList', async function (req, res, next) {
    try {
        // 获取用户id
        const { id } = req.user;

        // 查询添加列表
        let list = await getAddList(id);

        if (!list.length) {
            return res.send({ message: '暂无添加好友' });
        }

        list = list.map(data => data.friend_id);

        let addList = await getUsersByIds(list);

        addList = userInfoFilter(...addList);

        res.send({ message: '查询成功', data: { addList } });
    } catch (error) {
        next(error);
    }

});


/**
 * 好友申请列表
 */
router.get('/agreeList', async function (req, res, next) {
    try {
        const { id } = req.user;
        let idList = await getAgreeList(id);
        idList = idList.map(data => data.user_id);

        console.log(id, idList);

        if (!idList.length) {
            return res.send({ message: '还没有好友申请' });
        }

        let agreeList = await getUsersByIds(idList);
        agreeList = userInfoFilter(...agreeList);

        res.send({ message: '查询成功', agreeList });

    } catch (error) {
        next(error)
    }
});

/**
 * 同意好友
 */
router.get('/agree', async function (req, res, next) {
    try {
        // 获取用户 ID 和好友 id
        const { id } = req.user;
        const { friend } = req.query;
        const data = await getIdByUsername(friend);
        if (!data.length) {
            return res.send({ message: '查无此人' });
        }
        const [{ id: friend_id }] = data;

        // 验证是否有申请
        const relation = await queryFriend(friend_id, id);
        if (!relation.length) {
            return res.send({ message: '暂无好友申请' });
        }

        // 验证是否已经申请过
        const relation1 = await queryFriend(id, friend_id);
        if (relation1.length) {
            if(relation1[0].status === 1) {
                return res.send({ message: '已经同意过好友' });
            }
        }

        // 发起同意好友
        const result = await agreeFriend(id, friend_id);
        if (result[0].affectedRows !== 1 || result[1].affectedRows !== 1) {
            return res.send({ message: '同意失败，请稍后再试' });
        }
        return res.send({ message: '同意成功' });
    } catch (error) {
        next(error);
    }
});

/**
 * 拉黑好友
 */
router.get('/black', async function (req, res, next) {
    try {
        const { friend } = req.query;
        const { id } = req.user;
        // 查询朋友 id
        const [{ id: friend_id }] = await getIdByUsername(friend);

        // 查询是否为好友
        const relation = await queryFriend(id, friend_id);
        const relation1 = await queryFriend(friend_id, id);
        if (!relation.length || !relation1.length) {
            return res.send({ message: '还不是好友，无法拉黑' });
        }

        // 拉黑
        const result = await blackFriend(id, friend_id);
        if (result.affectedRows !== 1) {
            return res.send({ message: '出了点小差错，稍后再试' });
        }
        res.send({ message: '拉黑成功' });
    } catch (error) {
        next(error);
    }

});

/**
 * 拉黑好友列表
 */
router.get('/blackList', async function (req, res, next) {
    try {
            const { id } = req.user;
        let idList = await getBlackList(id);
        if (!idList.length) {
            return res.send({ message: '暂时没有拉黑的人' });
        }
        idList = idList.map(data => data.friend_id);
        let blackList = await getUsersByIds(idList);
        blackList = userInfoFilter(...blackList);
        res.send({ message: '查询成功', blackList });
    } catch (error) {
        next(error);
    }
});

/**
 * 取消拉黑
 */
router.get('/cancelBlack', async function (req, res, next) {
    try {
        const {id} = req.user;
        const {friend} = req.query;

        const [{ id: friend_id }] = await getIdByUsername(friend);
        // 查询是否拉黑
        const relation = await queryFriend(id, friend_id);
        if(relation[0].status !== 3) {
            return res.send({message: '没有拉黑'});
        }
        // 取消拉黑
        const result = await cancelBlack(id, friend_id);
        if (result.affectedRows !== 1) {
            return res.send({ message: '出了点小差错，稍后再试' });
        }
        res.send({ message: '取消拉黑成功' });
    } catch (error) {
        next(error);
    }
})

/**
 * 删除好友
 */
router.get('/del', async function (req, res, next) {
    try {
        const { id } = req.user;
        const { friend } = req.query;

        const [{ id: friend_id }] = await getIdByUsername(friend);
        // 查询是否为好友
        const relation = await queryFriend(id, friend_id);
        const relation1 = await queryFriend(friend_id, id);
        if (!relation.length || !relation1.length) {
            return res.send({ message: '还不是好友，无法删除' });
        }

        // 查询是否被拉黑
        if(relation[0].status === 3) {
            return res.send({message: '拉黑了无法删除'});
        }

        // 删除
        const result = await delFriend(id, friend_id);
        const result1 = await delFriend(friend_id, id);
        if (result.affectedRows !== 1 || result1.affectedRows !== 1) {
            return res.send({ message: '出了点小差错，稍后再试' });
        }
        res.send({ message: '删除成功' });
    } catch (error) {
        next(error)
    }
});

module.exports = router;