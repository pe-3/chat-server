const express = require('express');
const { generateCode } = require('../utils');
// const nodemailer = require('nodemailer');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

// 发送验证码用的模版
// const template = ejs.compile(
//     fs.readFileSync(
//         path.resolve(
//             __dirname,
//             '../template/mail.ejs'
//         ),
//         'utf-8'
//     )
// );

const router = express.Router();

// 邮箱验证码路由
function validateEmail(mail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(mail);
}

// 创建用来发送邮件的传输对象
// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     auth: {
//         type: 'oauth2',
//         user: 'guoxiaodong167@gmail.com',
//         clientId: '906351627676-oqia9gmt65thpmigkgu2p62823imqteg.apps.googleusercontent.com',
//         clientSecret: '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',
//     }
// });

// 发送验证码
router.post('/', async function (req, res) {
    // 验证邮箱地址是否合法
    const { mail } = req.body;
    if (!mail) {
        return res.send({
            message: '邮箱不能为空'
        });
    }
    if (!validateEmail(mail)) {
        return res.send({
            message: '邮箱地址不合法'
        });
    }

    // 生成验证码
    const code = generateCode();
    // const html = template({ code });

    // 发送验证码
    // transporter.sendMail(
    //     {
    //         from: 'guoxiaodong167@gmail.com',
    //         to: mail,
    //         html,
    //         subject: '邮箱验证'
    //     },
    //     (err, info) => {
    //         if (err) {
    //             return res.send({ message: '验证码发送失败', err });
    //         }
    //         res.send({ info, message: '验证码发送成功' });
    //     }
    // );


    // 全局存储验证码，给注册路由查看
    req.signal.set(mail, code);

    // 假装发送验证码
    res.send({
        message: '验证码发送成功'
    });

    console.log({
        mail,
        code
    });
})

// 验证验证码

module.exports = router;

