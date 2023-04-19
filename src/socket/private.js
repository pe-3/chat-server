/**
 * 私聊
 */

module.exports = function (data, ws, req, {map, caches}) {
    const { message } = data;
    console.log(message);
    const { to } = message;
    const targetWs = map.get(to);
    targetWs && targetWs.send(JSON.stringify({
        type: 'private',
        message
    }));
    if (!targetWs) {
        /**
         * 留言  ;
         */
        if(!caches.has(to)) {
            caches.set(to, []);
        }
        caches.get(to).unshift(data);
    }
}