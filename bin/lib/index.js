const fs = require('fs-extra');
const spawn = require('cross-spawn'); 
const path = require('path');
const chokidar = require('chokidar');
const glob = require('fast-glob');

const _Directorys = {
    developmentRoot: 'shop/src',
    productionRoot: 'shop/dist',
    devRoot: 'shop/src/dev',
    stylesRoot: 'shop/src/dev/styles',
    scriptsRoot: 'shop/src/dev/js',
    fontsRoot: 'shop/src/dev/fonts',
    imagesRoot: 'shop/src/dev/images',
    layoutRoot: 'shop/src/layout',
    templatesRoot: 'shop/src/templates',
    snippetsRoot: 'shop/src/snippets',
    sectionsRoot: 'shop/src/sections',
    configRoot: 'shop/src/config',
    localesRoot: 'shop/src/locales',
    assetsRoot: 'shop/src/assets'
};

const handleError = (code = 1, message = '') => {
    console.error(message);
    process.exit(code);
};

const progressiveTerminalLine = (data) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(data);
};

const cloneDirectory = async (directoryToCopy = _Directorys.productionRoot, directoryDestination = _Directorys.developmentRoot) => {
    try {
        return await fs.copy(directoryToCopy, directoryDestination);
    } catch (err) {
        return console.error(err);
    }
};

const moveFile = async (fileToMove, fileDestination) => {
    try {
        return await fs.move(fileToMove, `${fileDestination}/${path.basename(fileToMove)}`);
    } catch (err) {
        return console.error(err);
    }
};

const createWorkingDirectory = async () => {
    await cloneDirectory(_Directorys.productionRoot, _Directorys.developmentRoot)
    .then(() => moveAssetsToDev())
    .catch(err => console.error(err));
};

const moveAssetsToDev = async () => {
    
    const watcher = chokidar.watch('./shop/src/assets');
    watcher.on('unlink', async () => {
        const assets = await fs.readdirSync('./shop/src/assets');
        if(assets.length === 0) {
            await fs.removeSync('./shop/src/assets');
            watcher.close();
        }
    });

    const images = await glob(['./shop/src/assets/*.jpg', './shop/src/assets/*.png', './shop/src/assets/*.gif', './shop/src/assets/*.webp', './shop/src/assets/*.svg']);
    const fonts = await glob(['./shop/src/assets/*.otf', './shop/src/assets/*.ttf', './shop/src/assets/*.eot', './shop/src/assets/*.woff', './shop/src/assets/*.woff2', './shop/src/assets/*.txt']);
    const styles = await glob(['./shop/src/assets/*.css', './shop/src/assets/*.scss', './shop/src/assets/*.css.liquid', './shop/src/assets/*.scss.liquid']);
    const scripts = await glob(['./shop/src/assets/*.js', './shop/src/assets/*.js.liquid']);

    for(const image of images) {
        await moveFile(image, _Directorys.imagesRoot);
    }

    for(const font of fonts) {
        await moveFile(font, _Directorys.fontsRoot);
    }

    for(const style of styles) {
        await moveFile(style, _Directorys.stylesRoot);
    }

    for(const script of scripts) {
        await moveFile(script, _Directorys.scriptsRoot)
    }
    
};

const spawnCallback = (data, isProgressive = false, callback = null) => {
    const dataToLog = (Buffer.isBuffer(data) == true) ? data.toString() : data;
    if(typeof callback === 'function') {
        if(isProgressive) {
            progressiveTerminalLine(dataToLog);
            callback(dataToLog);
        } else {
            console.log(dataToLog);
            callback(dataToLog);
        }
    } else {
        if(isProgressive) {
            progressiveTerminalLine(dataToLog);
        } else {
            console.log(dataToLog);
        }
    }
};


const watchWorkingDirectoryForChanges = () => {
    // TODO: Probably need some sort of error handling in here at some stage.
    // Need to see how well it works to begin with.
    const addFile = async (e, watcher) => {
        let fileKey = e.replace(/src(.*?)/, 'dist');
        fileKey = fileKey.replace(/dev(.*?)/, 'assets');
        fileKey = fileKey.replace(/images(.*?)/, '');
        fileKey = fileKey.replace(/fonts(.*?)/, '');

        const dataToWrite = await fs.readFileSync(e);

        await fs.writeFileSync(fileKey, dataToWrite);
    };

    const updateFile = async (e, watcher) => {
        let fileKey = e.replace(/src(.*?)/, 'dist');
        fileKey = fileKey.replace(/dev(.*?)/, 'assets');
        fileKey = fileKey.replace(/images(.*?)/, '');
        fileKey = fileKey.replace(/fonts(.*?)/, '');

        const source = await fs.readFileSync(e);
        const target = await fs.readFileSync(fileKey);
        if(Buffer.compare(source, target) !== 0) await fs.writeFileSync(fileKey, source);
    };

    const removeFile = async (e, watcher) => {
        let fileKey = e.replace(/src/g, 'dist');
        fileKey = fileKey.replace(/dev(.*?)/, 'assets');
        fileKey = fileKey.replace(/images(.*?)/, '');
        fileKey = fileKey.replace(/fonts(.*?)/, '');
        const isFileExists = await fs.existsSync(fileKey);

        if(isFileExists === true) await fs.removeSync(fileKey);
    };

    const watcher = chokidar.watch(_Directorys.developmentRoot, { ignored: ['shop/src/dev/js', 'shop/src/dev/styles'] });
    watcher.on('change', updateFile);
    watcher.on('add', addFile);
    watcher.on('unlink', removeFile);
};

const downloadThemeFiles = async () => {
    const isDirExists = await fs.existsSync('/shop/dist');
    if(isDirExists === false) await fs.mkdirSync(path.join(__dirname, '/shop/dist'), { recursive: true });

    const callback = (data) => (data.indexOf('100 %') != -1) ? createWorkingDirectory() : null;
    const command = spawn('theme', ['download', `--dir=${path.relative(__dirname, '/shop/dist')}`]);
    command.stdout.on('data', data => spawnCallback(data, true, callback(data)));
    command.stderr.on('data', data => spawnCallback(data, true));
    command.on('error', err => handleError(err.errno, err));
};

// const deployThemeFile = (file = '') => {
//     const command = spawn('theme', ['deploy', file]);
//     command.stdout.on('data', data => spawnCallback(data, true));
//     command.stderr.on('data', data => spawnCallback(data, false));
//     command.on('error', err => handleError(err.errno, err));
// };

const intializeWebpack = () => {
    const command = spawn('npx', ['webpack']);
    command.stdout.on('data', data => spawnCallback(data, false));
    command.stderr.on('data', data => spawnCallback(data, false));
    command.on('error', err => handleError(err.errno, err));
};


module.exports = {
    downloadThemeFiles,
};
