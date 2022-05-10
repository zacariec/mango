import { cloneDirectory } from './utils/_fsUtils';
import { createDevDirectory, moveAssetsToDev } from './convert/convert';
import deployThemeFile from './deploy/deploy';
import downloadThemeFiles from './download/download';
import { liveReload } from './reload/liveReload.js';
import { initializeWebpack, initializeThemekit, initializeWorkingDirectory } from './watch/watch';
import getVersion from './version/version';

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

export {
  createWorkingDirectory,
  deployThemeFile,
  downloadThemeFiles,
  initializeWatchers,
  getVersion,
};
