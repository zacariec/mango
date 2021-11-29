const { cloneDirectory } = require('./utils/_fsUtils');
const { createDevDirectory, moveAssetsToDev } = require('./convert/convert');
const { deployThemeFile } = require('./deploy/deploy');
const downloadThemeFiles = require('./download/download');
const { liveReload } = require('./reload/liveReload');
const { initializeWebpack, initializeThemekit, initializeWorkingDirectory } = require('./watch/watch');
const { getVersion } = require('./version/version');

// TODO: Handle console.errors(), probably prettify output with
// chalk and a handler that takes in a callback etc - across all modules.

const createWorkingDirectory = async () => {
  await cloneDirectory();
  await createDevDirectory();
  await moveAssetsToDev();
};

const initializeWatchers = () => {
  initializeThemekit()
    .then(() => liveReload())
    .then(() => initializeWebpack())
    .then(() => initializeWorkingDirectory())
    .catch(err => console.error(err));
};

module.exports = {
  createWorkingDirectory,
  deployThemeFile,
  downloadThemeFiles,
  initializeWatchers,
  getVersion,
};
