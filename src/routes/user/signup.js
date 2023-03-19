/**
 * 用户注册
 */

// 引入操作数据库的函数
const {
    getUserByUsername,
    addUser,
} = require('../../mysql/user');

const fs = require('fs');
const path = require('path');

// 引入一些工具
const bcrypt = require('bcrypt');

module.exports = {
    async post(req, res) {
        const {
            username,
            password,
            mail,
            code
        } = req.body;

        /**
         * 查看邮箱验证码是否正确
         */
        if (!code || req.signal.get(mail) !== code) {
            return res.fail('邮箱验证码错误');
        }
        else {
            req.signal.delete(mail);
        }

        /**
         * 检查用户名是否已被注册
         */
        const user = await getUserByUsername(username);
        if (
            user instanceof Array
            && user.length
        ) {
            return res.fail('该用户已经注册过了');
        }

        /**
         * 加密密码
         */
        const hashedPass = await bcrypt.hash(password, 10);

        /**
         * 创建新用户
         */
        const newUser = {
            username,
            password: hashedPass,
            mail
        };



        /**
         * 写入数据库
         */
        const { affectedRows } = await addUser(newUser);
        if (affectedRows === 1) {
            /**
             * 开发环境下将账户写入 accounts.txt
             */
            if (process.env.NODE_ENV !== 'production') {
                fs.appendFile(
                    path.join(__dirname, '../../../accounts.txt'),
                    `\n账号：${username}，密码：${password}。`,
                    (err) => {
                        if (!err) {
                            console.log('成功记录账号', { username, password });
                        }
                    }
                );
            }
            return res.success('注册成功');
        }

        return res.fail('服务器出现问题，请稍后再试');
    }
}