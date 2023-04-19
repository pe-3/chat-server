/**
 * socket 登录了
 */
const { verify } = require('../midware/auth');
const { setLastOnlineTime } = require('../mysql/user');
module.exports = async function (data, ws, req, { map, caches }) {
    try {
        const { token } = data;
        const { username, id } = await verify(token.split(' ')[1]);
        // 记录这个用户对应的 ws
        map.set(username, ws);

        ws.on('close', () => {
            map.delete(username);
            console.log(username + '下线了');
        });

        // if 登录后为此用户创建缓存 else 将缓存的消息发送
        if (!caches.has(username)) {
            caches.set(username, []);
        }
        else {
            const cache = caches.get(username);
            caches.set(username, []);
            ws.send(JSON.stringify({
                message: cache.reverse(),
                type: 'online'
            }));
        }

        // 更新登录时间
        const date = Date.now();
        const res = await setLastOnlineTime(id, date);
        if (res.affectedRows === 1) {
            return console.log(username + '上线了');
        }
    } catch (error) {
        console.warn(error);
    }
}