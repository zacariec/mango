import path from 'path';
import chokidar from 'chokidar';
import * as WebSocket from 'ws';
import spawn from 'cross-spawn';
import _Directories from '../utils/_directorys';
import { spawnCallback, handleError } from '../utils/_logUtils';
import { addFile, updateFile, removeFile } from '../utils/_fileHelpers';

const initializeWorkingDirectory = () => {

  const watcher = chokidar.watch(_Directories.developmentRoot, {
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

const initializeThemekit = (): Promise<void> => {
  const wss = new WebSocket.Server({ port: 9000 });
  let client = undefined;
  wss.on('connection', ws => {
    client = ws;
  });

  const liveReloadCallback = (data) => (typeof client != 'undefined' && data.includes('Updated')) ? client.send('event') : null;

  return new Promise((resolve) => {
    spawn(_Directories.theme, ['open'], { stdio: 'pipe' });
    const command = spawn(_Directories.theme, ['watch', `--dir=${path.resolve('./shop/dist')}`], { stdio: 'pipe' });
    command.stdout.on('data', data => {
        spawnCallback(data, false, liveReloadCallback);
        if(data.toString().includes('Watching for file changes')) resolve();
    });
    command.stderr.on('data', data => spawnCallback(data, false));
    command.on('error', err => handleError(err.errno, err));
  });
};

const initializeWebpack = (): Promise<void> => {
  return new Promise(resolve => {
    const command = spawn('npx', ['webpack'], { stdio: 'pipe' });
    command.stdout.on('data', data => spawnCallback(data, false));
    command.stderr.on('data', data => spawnCallback(data, false));
    command.on('error', err => handleError(err.errno, err));
    resolve();
  });
};

export {
  initializeWorkingDirectory,
  initializeThemekit,
  initializeWebpack
};
