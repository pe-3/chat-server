/**
 * 更新用户信息
 */
const { USER_PROPS_WRITEABLE } = require('../../config/user');
const { updateUser } = require('../../mysql/user');

module.exports = {
    auth: true,
    async post(req, res) {
        /**
         * 获取要更新的信息对象
         */
        const userInfo = req.body;
        console.log(1);

        /**
         * 获取用户的 id
         */
        const { id } = req.user;
        console.log(userInfo);
        /**
         * 过滤数据，不能直接更新的属性比如 用户名、密码等
         */
        const updateProps = USER_PROPS_WRITEABLE.reduce((pre, propK) => {
            if (userInfo[propK]) pre[propK] = userInfo[propK];
            return pre;
        }, {});

        /**
         * 判空
         */
        if (JSON.stringify(updateProps) === '{}') {
            return res.fail('没有要更新的信息');
        }

        /**
         * 更新数据的数据
         */
        const result = await updateUser(id, updateProps);
        if (result.affectedRows !== 1) {
            return res.fail('更新失败');
        }
        else {
            return res.success('更新成功');
        }
    }
}