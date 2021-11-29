const path = require('path');
const chokidar = require('chokidar');
const WebSocket = require('ws');
const spawn = require('cross-spawn');
const _Directorys = require('../utils/_directorys');
const { spawnCallback, handleError } = require('../utils/_logUtils');
const { addFile, updateFile, removeFile } = require('../utils/_fileHelpers');

const initializeWorkingDirectory = () => {

  const watcher = chokidar.watch(_Directorys.developmentRoot, {
    ignored: [
      path.resolve('./shop/src/dev/js'),
      path.resolve('./shop/src/dev/styles'),
      path.resolve('./shop/src/assets'),
      path.resolve('./shop/dist'),
    ]
  });

  watcher.on('change', updateFile);
  watcher.on('add', addFile);
  watcher.on('unlink', removeFile);
};

const initializeThemekit = () => {
  const wss = new WebSocket.Server({ port: 9000 });
  let client = undefined;
  wss.on('connection', ws => {
    client = ws;
  });

  const liveReloadCallback = (data) => (typeof client != 'undefined' && data.includes('Updated')) ? client.send('event') : null;

  return new Promise(resolve => {
    spawn(_Directorys.theme, ['open'], { stdio: 'pipe' });
    const command = spawn(_Directorys.theme, ['watch', `--dir=${path.resolve('./shop/dist')}`], { stdio: 'pipe' });
    command.stdout.on('data', data => {
        spawnCallback(data, false, liveReloadCallback);
        if(data.toString().includes('Watching for file changes')) resolve();
    });
    command.stderr.on('data', data => spawnCallback(data, false));
    command.on('error', err => handleError(err.errno, err));
  });
};

const initializeWebpack = () => {
  return new Promise(resolve => {
    const command = spawn('npx', ['webpack'], { stdio: 'pipe' });
    command.stdout.on('data', data => spawnCallback(data, false));
    command.stderr.on('data', data => spawnCallback(data, false));
    command.on('error', err => handleError(err.errno, err));
    resolve();
  });
};

module.exports = {
  initializeWorkingDirectory,
  initializeThemekit,
  initializeWebpack
};
