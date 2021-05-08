const path = require('path');
const spawn = require('cross-spawn');
const fs = require('fs-extra');
const { spawnCallback, handleError } = require('../utils/_logUtils');

const downloadThemeFiles = async () => {
    const isDirExists = await fs.existsSync(path.resolve('./shop/dist'));
    if(isDirExists === false) await fs.mkdirSync(path.resolve('./shop/dist'), { recursive: true });

    const command = spawn('theme', ['download', `--dir=${path.resolve('./shop/dist')}`]);
    command.stdout.on('data', data => spawnCallback(data, true));
    command.stderr.on('data', data => spawnCallback(data, true));
    command.on('error', err => handleError(err.errno, err));
};

module.exports = {
    downloadThemeFiles
};
