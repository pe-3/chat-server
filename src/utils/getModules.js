const fs = require('fs');
const path = require('path');

function getmodules(dirPath) {
    function Loop(dirPath) {
        const files = fs.readdirSync(dirPath);
        const modules = [];
        files.forEach((file) => {
            const filePath = path.join(dirPath, file);
            if (fs.statSync(filePath).isDirectory()) {
                modules.push(...Loop(filePath, ''))
            } else if (path.extname(file) === '.js') {
                modules.push({
                    path: filePath,
                    module: require(filePath)
                });
            }
        });
        return modules;
    }
    return Loop(dirPath).map(m => ({
        path: m.path.replace(dirPath, '').replace('.js', '').replace('index', ''),
        module: m.module
    }));
}

module.exports = getmodules;