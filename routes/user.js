const express = require('express');
const bcrypt = require('bcrypt');
// 操作 user 表的方法
const {
  getUserByUsername,
  addUser,
  updateUser,
  getUserById
} = require('../mysql/user');

/**
 * 用户路由
 */

const router = express.Router();

/**
 * 用户注册
 */

router.post('/signup', async function (req, res, next) {
  try {
    const { username, password, mail, code } = req.body;

    // 查看邮箱验证码是否正确
    const real_code = req.signal.get(mail);
    if (real_code !== code) {
      return res.status(200).json({ message: '邮箱验证码错误' });
    }
    req.signal.delete(mail);

    // 检查用户名是否已被注册
    const user = await getUserByUsername(username);
    console.log(user);
    if (user instanceof Array && user.length) {
      return res.status(200).json({ message: '该用户名已被注册' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建新用户
    const newUser = {
      username,
      password: hashedPassword,
      mail
    };

    // 数据库加入新用户
    const data = await addUser(newUser);
    if (data.affectedRows === 1) {
      return res.status(201).json({ message: '注册成功' });
    }

    return res.status(200).json({ message: '服务器出现问题，请稍后再试' });
  } catch (error) {
    next(error);
  }
});

/**
 * 用户登录
 */

const { getToken } = require('../midware/auth');
router.post('/signin', async function (req, res, next) {

  try {
    const { username, password } = req.body;

    // 获取用户数据
    const [user] = await getUserByUsername(username);

    // 检查信息合法
    const isInfoCorrect = user && bcrypt.compareSync(password, user.password);
    if (!isInfoCorrect) {
      return res.status(200).json({ message: '用户名或者密码不正确' });
    }

    delete user.password;
    Object.keys(user).forEach(key => {
      if (!user[key]) {
        delete user[key];
      }
    });
    const payload = { ...user };

    // 生成 JWT
    const token = getToken(payload);
    res.json({ token, message: '登录成功' });
  } catch (error) {
    next(error);
  }
});

/**
 *  更新用户信息
 */

const { USER_PROPS_WRITEABLE } = require('../config/user');
const { authenticateToken } = require('../midware/auth');
router.put('/', authenticateToken, async function (req, res, next) {
  try {
    // 获取用户信息
    const user_info = req.body;
    const { id } = req.user;

    // 获取能更新的数据，多余的数据无效
    const update_props = USER_PROPS_WRITEABLE.reduce((pre, propname) => {
      if (user_info[propname]) {
        pre[propname] = user_info[propname];
      }
      return pre;
    }, {});

    console.log(update_props);
    if (JSON.stringify(update_props) === '{}') {
      return res.send({ message: '没有要更新的信息' });
    }

    // 更新数据
    const result = await updateUser(id, update_props);
    if (result.affectedRows !== 1) {
      return res.send({ message: '更新失败' });
    }

    res.send({ message: '更新成功' });
  } catch (error) {
    next(error);
  }
});

/**
 * 查找用户
 */
const { userInfoFilter } = require('../mysql/user');
router.get('/', authenticateToken, async function (req, res, next) {
  try {
    const { username } = req.query;

    // 查找用户
    const [user] = await getUserByUsername(username);

    if (!user) {
      return res.send({ message: '没有找到此人' });
    }

    // 找到了，删除敏感数据
    const [userinfo] = userInfoFilter(user);

    res.send({ message: '查找到了', data: { user: userinfo } });
  } catch (error) {
    next(error);
  }
});

/**
 * 查询个人信息
 */

router.get('/info', authenticateToken, async function (req, res, next) {
  try {
    const { id } = req.user;
    let [info] = await getUserById(id);
    [info] = userInfoFilter(info);
    res.send({ message: '查询成功', info });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
