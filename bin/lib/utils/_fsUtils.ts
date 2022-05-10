import path from 'path';
import fs from 'fs-extra';
import _Directories from './_directorys';
import sleep from './_sleep';

const createDirectory = async (directoryToMake) => {
  await sleep(250);
  if (await fs.pathExists(directoryToMake) === false) await fs.mkdir(directoryToMake);
};

const createRecursiveDirectory = async (directoriesToMake) => {
  try {
    await sleep(250);
    for (const dir of directoriesToMake) await createDirectory(dir);
  } catch (err) {
    return console.error(err);
  }
};

const checkWorkingDirectory = async () => {
  await sleep(250);
  if (await fs.pathExists(_Directories.shopRoot) === true
    && await fs.pathExists(_Directories.productionRoot) === true
    && await fs.pathExists(_Directories.developmentRoot) === true
    && await fs.pathExists(_Directories.devRoot) === true
    && await fs.pathExists(_Directories.scriptsRoot) === true
    && await fs.pathExists(_Directories.scriptsModuleRoot) === true
    && await fs.pathExists(_Directories.stylesRoot) === true
    && await fs.pathExists(_Directories.fontsRoot) === true
    && await fs.pathExists(_Directories.imagesRoot) === true) return true;
};

const checkDistDirectory = async () => {
  await sleep(250);
  if (await fs.pathExists(_Directories.shopRoot) === true
    && await fs.pathExists(_Directories.productionRoot) === true
    && await fs.pathExists(_Directories.distAssetsRoot) === true
    && await fs.pathExists(_Directories.distConfigRoot) === true
    && await fs.pathExists(_Directories.distLayoutRoot) === true
    && await fs.pathExists(_Directories.distLocalesRoot) === true
    && await fs.pathExists(_Directories.distSectionsRoot) === true
    && await fs.pathExists(_Directories.distSnippetsRoot) === true
    && await fs.pathExists(_Directories.distTemplatesRoot) === true) return true;
};

const cloneDirectory = async (directoryToCopy = _Directories.productionRoot, directoryDestination = _Directories.developmentRoot) => {
  await sleep(250);
  await fs.copy(directoryToCopy, directoryDestination);
};

const moveFile = async (fileToMove, fileDestination) => {
  await sleep(250);
  await fs.move(fileToMove, `${fileDestination}/${path.basename(fileToMove)}`)
};

export {
  createDirectory,
  createRecursiveDirectory,
  checkWorkingDirectory,
  checkDistDirectory,
  cloneDirectory,
  moveFile
};
