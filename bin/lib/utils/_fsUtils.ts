import path from 'path';
import fs from 'fs-extra';
import _Directories from './_directorys';
import sleep from './_sleep';

/**
 * Creates a directory from a path as a string.
 * @param directoryToMake
 */
const createDirectory = async (directoryToMake: string): Promise<boolean> => {
  await sleep(250);

  if (await fs.pathExists(directoryToMake) === true) {
    return false;
  }

  await fs.mkdir(directoryToMake);
  return true;
};

/**
 * Creates the directories from an array recursively.
 * @param directoriesToMake
 */
const createRecursiveDirectory = async (directoriesToMake: string[]): Promise<void> => {
  try {
    await sleep(250);
    for await (const dir of directoriesToMake) {
      await createDirectory(dir);
    }
  } catch (err) {
    return console.error(err);
  }
};

// TODO: Refactor checks for directories into one function that takes an array of directories..

/**
 * Checks the working directory, and returns true if all directories exist.
 */
const checkWorkingDirectory = async (): Promise<boolean> => {
  await sleep(250);
  const directories = [
    await fs.pathExists(_Directories.shopRoot),
    await fs.pathExists(_Directories.productionRoot),
    await fs.pathExists(_Directories.developmentRoot),
    await fs.pathExists(_Directories.devRoot),
    await fs.pathExists(_Directories.scriptsRoot),
    await fs.pathExists(_Directories.scriptsModuleRoot),
    await fs.pathExists(_Directories.stylesRoot),
    await fs.pathExists(_Directories.fontsRoot),
    await fs.pathExists(_Directories.imagesRoot),
  ];

  return !directories.includes(false);
};

/**
 * Checks the production directory and returns true if all directories exist.
 */
const checkDistDirectory = async (): Promise<boolean> => {
  await sleep(250);
  const directories = [
    await fs.pathExists(_Directories.shopRoot),
    await fs.pathExists(_Directories.productionRoot),
    await fs.pathExists(_Directories.distAssetsRoot),
    await fs.pathExists(_Directories.distConfigRoot),
    await fs.pathExists(_Directories.distLayoutRoot),
    await fs.pathExists(_Directories.distLocalesRoot),
    await fs.pathExists(_Directories.distSectionsRoot),
    await fs.pathExists(_Directories.distSnippetsRoot),
    await fs.pathExists(_Directories.distTemplatesRoot),
  ];

  return !directories.includes(false);
};

const cloneDirectory = async (
  directoryToCopy = _Directories.productionRoot,
  directoryDestination = _Directories.developmentRoot): Promise<void> => {
    await sleep(250);
    await fs.copy(directoryToCopy, directoryDestination);
};

const moveFile = async (fileToMove, fileDestination): Promise<void> => {
  await sleep(250);
  await fs.move(fileToMove, `${fileDestination}/${path.basename(fileToMove)}`)
};

const auditFile = async (file: string, auditSettings: string[]): Promise<string[]> => {
  const settings: string[] = [];
  if (file.includes('.liquid')) {
    const fileContent: Buffer = await fs.readFile(file);
  
    for await (const setting of auditSettings) {
      const settingString = `settings.${setting}`;
      if (fileContent.toString().includes(settingString)) {
        settings.push(settingString);
      }
    }
  }

  return settings;
};

const auditDirectoryFiles = async (): Promise<string[]> => {
  const files: string[] = [];
  const auditDirectories: string[] = [
    _Directories.layoutRoot,
    _Directories.templatesRoot,
    _Directories.customersRoot,
    _Directories.snippetsRoot,
    _Directories.sectionsRoot,
  ];

  for await (const directory of auditDirectories) {
    const filesToAudit = await fs.readdir(directory);

    for await (const file of filesToAudit) {
      await Promise.resolve(files.push(`${directory}/${file}`));
    }
  }

  return files;
};

export {
  auditDirectoryFiles,
  auditFile,
  createDirectory,
  createRecursiveDirectory,
  checkWorkingDirectory,
  checkDistDirectory,
  cloneDirectory,
  moveFile
};
