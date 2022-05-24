import { cloneDirectory } from './utils/_fsUtils';
import { createDevDirectory, moveAssetsToDev } from './convert/convert';
import deployThemeFile from './deploy/deploy';
import downloadThemeFiles from './download/download';
import { liveReload, removeLiveReload } from './reload/liveReload.js';
import { initializeWebpack, initializeThemekit, initializeWorkingDirectory } from './watch/watch';
import getVersion from './version/version';
import _randomPort from './utils/_createPort';

// TODO: Handle console.errors(), probably prettify output with
// chalk and a handler that takes in a callback etc - across all modules.

const createWorkingDirectory = async (): Promise<void> => {
  await cloneDirectory();
  await createDevDirectory();
  await moveAssetsToDev();
};

const initializeWatchers = async (environment: object): Promise<void> => {
  const port = await _randomPort();
  const env = environment;
  const stepsToRun = [
    initializeWebpack,
    initializeWorkingDirectory,
  ];
  await initializeThemekit(port, env);
  await removeLiveReload();
  await liveReload(port);

  try {
    for await (const step of stepsToRun) {
      await step();
    }
  } catch (err) {
    console.error(err);
    return process.exit(1);
  }
};

export {
  createWorkingDirectory,
  deployThemeFile,
  downloadThemeFiles,
  initializeWatchers,
  getVersion,
};
