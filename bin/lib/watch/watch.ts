import path from 'path';
import chokidar from 'chokidar';
import WebSocket from 'ws';
import spawn from 'cross-spawn';
import _Directories from '../utils/_directorys';
import { spawnCallback, handleError } from '../utils/_logUtils';
import { addFile, updateFile, removeFile } from '../utils/_fileHelpers';

// Initialize the Working directory watcher, provides the event system for the watchers.
const initializeWorkingDirectory = (): void => {
  // creates a chokidar watcher to watch the src root.
  const watcher = chokidar.watch(_Directories.developmentRoot, {
    ignored: [
      _Directories.scriptsRoot,
      _Directories.stylesRoot,
      _Directories.assetsRoot,
      _Directories.productionRoot,
    ]
  });

  // Watch these files in the src root for changes on update, add & remove.
  watcher.on('change', updateFile);
  watcher.on('add', addFile);
  watcher.on('unlink', removeFile);
};

const initializeThemekit = async (port: number, environment: object): Promise<void> => {
  let environments = [];
  if (Object.prototype.hasOwnProperty.call(environment, "env")) {
    environments = environment['env'].split(' ')
  }

  const wss = new WebSocket.Server({ port });
  let client: undefined | WebSocket = undefined;

  wss.on('connection', (ws: WebSocket) => client = ws);

  const liveReloadCallback = (data: string) => (typeof client != 'undefined' && data.includes('Updated')) ? client.send('event') : null;

  return new Promise((resolve) => {
    // Open the theme for each specified environment
    if (environments.length) {
      environments.forEach(env => {
        spawn(_Directories.theme, ['open', `-e=${env}`], { stdio: 'pipe' });
      });
    } else {
      spawn(_Directories.theme, ['open'], { stdio: 'pipe' });
    }

    // Start a themekit listener for each specified environment
    const themekitArguments = ['watch', `--dir=${path.resolve('./shop/dist')}`]

    environments.forEach(env => {
      themekitArguments.push(`-e=${env}`)
    });

    const command = spawn(_Directories.theme, themekitArguments, { stdio: 'pipe' });

    command.stdout.on('data', data => {
        spawnCallback(data, false, liveReloadCallback);
        if(data.toString().includes('Watching for file changes')) resolve();
    });
    command.stderr.on('data', data => spawnCallback(data, false));
    command.on('error', err => handleError(err.errno, err));
  });
};

const initializeWebpack = (): Promise<void> => {
  return new Promise((resolve) => {
    const command = spawn('npx', ['webpack'], { stdio: 'pipe' });
    command.stdout.on('data', (data: Buffer) => spawnCallback(data, false));
    command.stderr.on('data', (data: Buffer) => spawnCallback(data, false));
    command.on('error', (err) => handleError(err.errno, err));
    resolve();
  });
};

export {
  initializeWorkingDirectory,
  initializeThemekit,
  initializeWebpack,
};
