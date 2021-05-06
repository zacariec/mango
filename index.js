const fs = require('fs-extra');
const spawn = require('cross-spawn'); 
const chokidar = require('chokidar');

const _Directorys = {
    developmentRoot: './shop/src',
    productionRoot: './shop/dist',
    stylesRoot: './shop/src/dev/styles',
    stylesCss: './shop/src/dev/styles/*.css',
    stylesScss: './shop/src/dev/styles/*.scss',
    scriptsRoot: './shop/src/dev/js/*.js',
    fontsRoot: './shop/src/dev/fonts',
    imagesRoot: './shop/src/dev/images',
    layoutRoot: './shop/src/layout',
    templatesRoot: './shop/src/templates',
    snippetsRoot: './shop/src/snippets',
    sectionsRoot: './shop/src/sections',
    configRoot: './shop/src/config',
    localesRoot: './shop/src/locales',
    assetsRoot: './shop/src/assets'
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

// const cloneDirectory = async (directoryToCopy, directoryDestination) => {
//     try {
//         return await fs.copy(directoryToCopy, directoryDestination);
//     } catch (err) {
//         return console.error(err);
//     }
// };

// const createDistDirectory = async () => {
//     // TODO: Glob .js && .css || .scss files, 
//     // Anything at the top level of the /js or /styles 
//     // Directoy should be deployed to /dist/assets for the flexibility
//     // of allowing the end user to add files, other than images & fonts.

//     // Maybe we should just use the assets directory in src as well.
//     const directories = [
//         _Directorys.configRoot, 
//         _Directorys.layoutRoot, 
//         _Directorys.localesRoot,
//         _Directorys.sectionsRoot,
//         _Directorys.snippetsRoot,
//         _Directorys.templatesRoot,
//         _Directorys.imagesRoot,
//         _Directorys.fontsRoot,
//         _Directorys.scriptsRoot,
//         _Directorys.stylesScss,
//         _Directorys.stylesCss,
//     ];

//     function createDestinationPath(path) {
//         let destinationFolder = path.substring(path.lastIndexOf('/') + 1);
//         if(path.indexOf('dev') != -1) destinationFolder = 'assets';
//         return _Directorys.productionRoot + '/' + destinationFolder;
//     }

//     for(const directory of directories) {
//         await cloneDirectory(directory, createDestinationPath(directory));
//     }
// }

const spawnCallback = (data, isProgressive = false) => {
    const dataToLog = (Buffer.isBuffer(data) == true) ? data.toString() : data;
    if(isProgressive) progressiveTerminalLine(dataToLog);
    else console.log(dataToLog);
};

// const createWatcher = (directory) => {
//     return chokidar.watch(directory);
// };

const downloadThemeFiles = () => {
    const command = spawn('theme', ['download', `--dir=${_Directorys.developmentRoot}`]);
    command.stdout.on('data', data => spawnCallback(data, true));
    command.stderr.on('data', spawnCallback);
    command.on('error', handleError);
};

// const deployThemeFile = (file = '') => {
//     const command = spawn('theme', ['deploy', file]);
//     command.stdout.on('data', data => spawnCallback(data, true));
//     command.stderr.on('data', spawnCallback);
//     command.on('error', handleError);
// };

const watchJsThemeFiles = () => {
    const command = spawn('npx', ['webpack']);
    command.stdout.on('data', data => spawnCallback(data, false));
    command.stderr.on('data', spawnCallback);
    command.on('error', handleError);
};

const watchStyleFiles = (type = 'sass', input, output) => {
    // TODO: Chokidar + postcss to compile node -sass 
    const postcss = require('postcss');
    const postcssSass = require('postcss-node-sass');

    const fileType = (type === 'sass') ? 'shop/src/dev/css/**.scss' : 'shop/src/dev/css/**.css';
    const watchCommand = (type === 'sass') ? spawn('npx', ['sass', input, output, '--watch']) : spawn('npx', ['postcss', input, output, '--watch']);
    watchCommand.stdout.on('data', data => spawnCallback(data, false));
    watchCommand.stderr.on('data', data => spawnCallback(data, false));
    watchCommand.on('error', err => handleError(err.errno, err));

    const styleCommand = spawn('npx', ['stylelint', fileType]);
    styleCommand.stdout.on('data', data => spawnCallback(data, false));
    styleCommand.stderr.on('data', data => spawnCallback(data, false));
    styleCommand.on('error', err => handleError(err.errno, err));
};


// const watchFontsThemeFiles = () => {
//     const watcher = createWatcher(_Directorys.fontsRoot);
// };

// const watchImagesThemeFiles = () => {
//     const watcher = createWatcher(_Directorys.imagesRoot);
// };


watchScssThemeFiles();