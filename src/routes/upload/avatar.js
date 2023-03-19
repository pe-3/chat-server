/**
 * 上传头像
 */
const multer = require('multer');
const path = require('path');
const srgbToPNG = require('../../utils/srgb');
const { getHashByUnit8Array } = require('../../utils/hash');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 1, // 1MB
    }
});

module.exports = {
    auth: true,
    midwares: [upload.single('file')],
    async post(req, res) {
        const file = req.file;
        if (!file) {
            res.fail('没有选中图片');
        }
        /**
         * 获取照片的 srgb 数据
         */
        const srgbData = Uint8Array.from(file.buffer);
        
        /**
         * 根具数据哈希摘要获取头像文件名
         */
        const fileName = await getHashByUnit8Array(srgbData) + '.png';
        const filePath = path.join(__dirname, '../../../public/avatar/', fileName);

        /**
         * 根据数据和文件名生成图片文件，并放置于 /public/avatar 中
         */
        srgbToPNG({
            srgb: srgbData,
            width: 100,
            height: 100,
            filePath
        });

        /**
         * 返回给前端对应的数据
         */
        res.success('头像上传成功', {
            filename: file.filename,
            size: file.size,
            mimetype: file.mimetype,
            path: 'http://localhost:3000/static/avatar/' + fileName
        });
    }
}