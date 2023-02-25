const pool = require('./pool');
const pw = require('../utils/pw');

/**
 * 获取朋友列表
 * @param {*} user_id 用户 id
 */

function getFriendList(user_id, callback) {
    pool.query(
        'select friend_id from friends where status = 1 and user_id = ?',
        user_id,
        callback
    );
}

/**
 * 添加朋友
 * @param {*} user_id 用户 id
 * @param {*} friend_id 要添加的好友 id
 */
function addFriend(user_id, friend_id, callback) {
    pool.query(
        'insert into friends set ?', 
        {user_id, friend_id},
        callback
    );
}

/**
 * 获取添加列表 - 建立单向朋友关系的数据列表
 * @param {*} user_id 用户 id
 * @param {*} friend_id 要添加的好友 id
 */

function getAddList(user_id, callback) {
    pool.query(
        'select friend_id from friends where user_id = ? and status = 0', 
        user_id, 
        callback
    );
}

/**
 * 同意对方添加为好友
 * 
 * 更新状态为朋友后，插入一条对等的数据（对等意思是互相为对方朋友）
 * 也就是说，好友关系建立后，有两条数据库的数据
 * 
 * @param {*} user_id 用户 id
 * @param {*} friend_id 要添加的好友 id
 */

function agreeFriend(user_id, friend_id, callback) {
    pool.query(
        'update friends set status = 1 where user_id = ? and friend_id = ?',
        [friend_id, user_id],
        (err, data) => {
            if(err) {
                return callback(err);
            }
            pool.query(
                'insert into friends set ?',
                {
                    user_id,
                    friend_id,
                    status: 1
                },
                (err_, data_) => {
                    if(err_) {
                        return callback(err_);
                    }
                    callback(null, [data, data_]);
                }
            );
        }
    );

}

/**
 * 获取好友申请列表
 * @param {*} user_id 
 * @param {*} callback 
 */

function getAgreeList(user_id, callback) {
    pool.query(
        'select user_id from friends where friend_id = ? and status = 0', 
        user_id,
        callback
    );
}

/**
 * 拉黑一个好友
 * @param {*} user_id
 * @param {*} friend_id
 * @param {*} callback
 */

function blackFriend(user_id, friend_id, callback) {
    pool.query(
        'update friends set status = 3 where user_id = ? and friend_id = ?', 
        [user_id, friend_id],
        callback
    );
}

/**
 * 获取拉黑列表
 * @param {*} user_id
 * @param {*} callback 
 */

function getBlackList(user_id, callback) {
    pool.query(
        'select friend_id from friends where user_id = ? and status = 3',
        user_id, 
        callback
    );
}

/**
 * 取消拉黑好友
 * @param {*} user_id
 * @param {*} friend_id
 * @param {*} callback
 */

function cancelBlack(user_id, friend_id, callback) {
    pool.query(
        'update friends set status = 1 where user_id = ? and friend_id = ?', 
        [user_id, friend_id],
        callback
    );
}

/**
 * 单向删除好友
 * @param {*} user_id
 * @param {*} friend_id
 * @param {*} callback
 */
function delFriend(user_id, friend_id, callback) {
    pool.query(
        'update friends set status = 2 where user_id = ? and friend_id = ?', 
        [user_id, friend_id],
        callback
    );
}

/**
 * 查询曾经是否添加过好友
 * @param {*} user_id 
 * @param {*} friend_id 
 * @param {*} callback 
 */
function queryFriend(user_id, friend_id, callback) {
    pool.query(
        'select * from friends where user_id = ? and friend_id = ?',
        [user_id, friend_id],
        callback
    );
}

/**
 * 恢复为好友
 * @param {*} user_id 
 * @param {*} friend_id 
 * @param {*} callback 
 */

function recoveryFriend(user_id, friend_id, callback) {
    pool.query(
        'update friends set status = 0 where user_id = ? and friend_id = ?', 
        [user_id, friend_id],
        callback
    );
}

module.exports = {
    getFriendList: pw(getFriendList),
    addFriend: pw(addFriend),
    getAddList: pw(getAddList),
    agreeFriend: pw(agreeFriend),
    getAgreeList: pw(getAgreeList),
    blackFriend: pw(blackFriend),
    getBlackList: pw(getBlackList),
    cancelBlack: pw(cancelBlack),
    delFriend: pw(delFriend),
    queryFriend: pw(queryFriend),
    recoveryFriend: pw(recoveryFriend)
}