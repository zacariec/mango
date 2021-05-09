const path = require('path');
const spawn = require('cross-spawn');
const { spawnCallback, handleError } = require('../utils/_logUtils');

const deployThemeFile = (file = '') => {
    const command = spawn('theme', ['deploy', path.resolve(`./${file}`)], { stdio: 'pipe' });
    command.stdout.on('data', data => spawnCallback(data, true));
    command.stderr.on('data', data => spawnCallback(data, false));
    command.on('error', err => handleError(err.errno, err));
};

module.exports = {
    deployThemeFile
};
