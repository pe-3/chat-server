const pool = require('./pool');
const pw = require('../utils/pw');
const { USER_PROPS_SENSITIVE, USER_PROPS_WRITEABLE } = require('../config/user');

function getUserById(id, callback) {
    pool.query(
        'SELECT * FROM users WHERE id = ?',
        [id],
        callback
    );
}

function getIdByUsername(username, callback) {
    pool.query(
        'select id from users where username = ?',
        username,
        callback
    );
}

function getUsersByIds(idList, callback) {
    pool.query(
        'SELECT * FROM users WHERE id IN (?)',
        [idList],
        callback
    );
}

function addUser(user, callback) {
    pool.query(
        'INSERT INTO users SET ?',
        user,
        callback
    );
}

function updateUser(id, user, callback) {
    pool.query(
        'UPDATE users SET ? WHERE id = ?',
        [user, id],
        callback
    );
}

/**
 * 删除，之后考虑，因为要牵扯多张表
 */
function deleteUser(id, callback) {
    pool.query(
        'DELETE FROM users WHERE id = ?',
        [id],
        callback
    );
}

function getUserByUsername(username, callback) {
    pool.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        callback
    );
}

function setLastOnlineTime(id, time, callback) {
    pool.query(
        'update users set last_online_time = ? where id = ?',
        [time, id],
        callback
    )
}

function userInfoFilter(...userInfos) {
    return userInfos.map(info => {
        USER_PROPS_SENSITIVE.forEach((prop) => {
            if (info[prop]) {
                delete info[prop];
            }
        });

        USER_PROPS_WRITEABLE.forEach((prop) => {
            if (!info[prop]) {
                delete info[prop];
            }
        });
        return { ...info };
    });
}

module.exports = {
    getUserById: pw(getUserById),
    getUsersByIds: pw(getUsersByIds),
    getIdByUsername: pw(getIdByUsername),
    getUserByUsername: pw(getUserByUsername),
    addUser: pw(addUser),
    updateUser: pw(updateUser),
    deleteUser: pw(deleteUser),
    setLastOnlineTime: pw(setLastOnlineTime),
    userInfoFilter
};