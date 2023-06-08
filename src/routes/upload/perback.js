/**
 * 上传背景
 */
const multer = require('multer');
const { getHashByBuffer } = require('../../utils/hash');
const pw = require('../../utils/pw');
const path = require('path');
const fs = require('fs');

const upload = multer({
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    }
});

module.exports = {
    auth: true,
    midwares: [upload.single('file')],
    async post(req, res) {
        try {
            const file = req.file;
            /**
             * 生成文件名和文件路径
             */
            const fileName = getHashByBuffer(file.buffer) + '.' + file.mimetype.split('/')[1];
            const filePath = path.join(__dirname, '../../../public/perback/', fileName);

            /**
             * 写入文件
             */
            await pw(fs.writeFile)(filePath, file.buffer);
    
            /**
             * 将地址返回给前端
             */
            res.success('上传成功', {
                filename: fileName,
                size: file.size,
                path: 'http://localhost:3000/static/perback/' + fileName,
                mimetype: file.mimetype,
            });
        }
        catch(e) {
            console.log(e);
        }
    }
};