const path = require('path');
const fs = require('fs-extra');
const chokidar = require('chokidar');
const WebSocket = require('ws');
const spawn = require('cross-spawn');
const _Directorys = require('../utils/_directorys');
const { spawnCallback, handleError } = require('../utils/_logUtils');

const initializeWorkingDirectory = () => {
    // TODO: Probably need some sort of error handling in here at some stage.
    // Need to see how well it works to begin with.
    const addFile = async (e, watcher) => {  
        try {
            let fileKey = e.replace(/src(.*?)/, 'dist');
            fileKey = fileKey.replace(/dev(.*?)/, 'assets');
            fileKey = fileKey.replace(/images(.*?)/, '');
            fileKey = fileKey.replace(/fonts(.*?)/, '');
            const source = await fs.readFile(e);
            await fs.writeFile(fileKey, source);
        } catch (err) {
            return console.error(err);
        }
    };

    const updateFile = async (e, watcher) => {       
        try {
            let fileKey = e.replace(/src(.*?)/, 'dist');
            fileKey = fileKey.replace(/dev(.*?)/, 'assets');
            fileKey = fileKey.replace(/images(.*?)/, '');
            fileKey = fileKey.replace(/fonts(.*?)/, '');
            const source = await fs.readFile(e);
            const target = await fs.readFile(fileKey);
            if(Buffer.compare(source, target) !== 0) await fs.writeFile(fileKey, source);
        } catch (err) {
            return console.error(err);
        }
    };

    const removeFile = async (e, watcher) => {
        try {
            let fileKey = e.replace(/src/g, 'dist');
            fileKey = fileKey.replace(/dev(.*?)/, 'assets');
            fileKey = fileKey.replace(/images(.*?)/, '');
            fileKey = fileKey.replace(/fonts(.*?)/, '');
            const isFileExists = await fs.pathExists(fileKey);
            if(isFileExists === true) await fs.remove(fileKey);
        } catch (err) {
            return console.error(err);
        }

    };

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
        spawn('theme', ['open'], { stdio: 'pipe' });
        const command = spawn('theme', ['watch', `--dir=${path.resolve('./shop/dist')}`], { stdio: 'pipe' });
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
