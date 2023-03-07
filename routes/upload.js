const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const srgbToPNG = require('../utils/srgb');
const { getHashByUnit8Array, getHashByBuffer } = require('../utils/hash');
const fs = require('fs');
const e = require('express');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 1, // 5MB
    }
});

router.post('/avatar', upload.single('file'), async function (req, res, next) {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('没有选中图片.');
        }
        const srgbData = Uint8Array.from(file.buffer);
        console.log(srgbData);

        const fileName = await getHashByUnit8Array(srgbData) + '.png';

        console.log(fileName);

        srgbToPNG({
            srgb: srgbData,
            width: 100,
            height: 100,
            filePath: path.resolve(__dirname, '../public/avatar/' + fileName)
        });

        res.json({
            filename: file.filename,
            size: file.size,
            mimetype: file.mimetype,
            path: 'http://localhost:3000/static/avatar/' + fileName,
            message: '头像上传成功'
        });


    } catch (error) {
        console.log(error)
    }
});

const perUpload = multer({
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    }
});

router.post('/perback', perUpload.single('file'), (req, res, next) => {
    try {
        const file = req.file;

        console.log(file);

        const fileName = getHashByBuffer(file.buffer) + '.' +file.mimetype.split('/')[1];

        fs.writeFile(
            path.resolve(__dirname, '../public/perback/' + fileName),
            file.buffer,
            (err) => {
                if (err) {
                    return next(err)
                }
                else {
                    res.send({
                        message: '上传成功',
                        filename: fileName,
                        size: file.size,
                        path: 'http://localhost:3000/static/perback/' + fileName,
                        mimetype: file.mimetype,
                    });
                }
            }
        );
    } catch (error) {
        console.log(error.message);
        next(error);
    }
});

module.exports = router;