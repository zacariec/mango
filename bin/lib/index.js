const _Directorys = require('./utils/_directorys');

const { cloneDirectory } = require('./utils/_fsUtils');
const { createDevDirectory, moveAssetsToDev } = require('./convert/convert');
const { deployThemeFile } = require('./deploy/deploy');
const { downloadThemeFiles } = require('./download/download');
const { liveReload } = require('./reload/liveReload');
const { initializeWebpack, initializeThemekit, initializeWorkingDirectory } = require('./watch/watch');

// TODO: Handle console.errors(), probably prettify output with
// chalk and a handler that takes in a callback etc - across all modules.

const createWorkingDirectory = () => {
    cloneDirectory(_Directorys.productionRoot, _Directorys.developmentRoot)
    .then(() => createDevDirectory())
    .then(() => moveAssetsToDev())
    .catch(err => console.error(err));
};

const initalizeWatchers = () => {
    initializeThemekit()
    .then(() => initializeWebpack())
    .then(() => initializeWorkingDirectory())
    .catch(err => console.error(err));
};

module.exports = {
    createWorkingDirectory,
    deployThemeFile,
    downloadThemeFiles,
    initalizeWatchers,
    liveReload,
};
