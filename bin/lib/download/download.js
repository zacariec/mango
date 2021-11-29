const path = require('path');
const spawn = require('cross-spawn');
const fs = require('fs-extra');
const { spawnCallback, handleError } = require('../utils/_logUtils');

module.exports = downloadThemeFiles = async () => {
  try {
    const isDirExists = await fs.pathExists(path.resolve('./shop/dist'));
    if (isDirExists === false) await fs.mkdir(path.resolve('./shop/dist'), { recursive: true });

    const command = spawn(_Directorys.theme, ['download', `--dir=${path.resolve('./shop/dist')}`], { stdio: 'pipe' });
    command.stdout.on('data', data => spawnCallback(data, true));
    command.stderr.on('data', data => spawnCallback(data, true));
    command.on('error', err => handleError(err.errno, err));
  } catch (err) {
    return console.error(err);
  }
};