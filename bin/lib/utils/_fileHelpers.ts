import fs from 'fs-extra';
import linkStyles from "../style-linking/styleLinking";
// TODO: Probably need some sort of error handling in here at some stage.
// Need to see how well it works to begin with.

/**
 * Reusuable func to replace the file directory of a file.
 * @param file
 */
const replaceFileKey = (file: string): string => {
  let key = file;

  key = key.replace(/src(.*?)/, 'dist');
  key = key.replace(/dev(.*?)/, 'assets');
  key = key.replace(/images(.*?)/, '');
  key = key.replace(/fonts(.*?)/, '');
  key = key.replace(/static(.*?)/, '');

  return key;
};

/**
 * Adds a file to the dist directory that themekit watches.
 * @param file
 */
const addFile = async (file: string): Promise<void> => {
  try {
    const fileKey = replaceFileKey(file);
    const source = await fs.readFile(file);

    await fs.writeFile(fileKey, source);
    await linkStyles(fileKey);
    return
  } catch (err) {
    return console.error(err);
  }
};

/**
 * Updates the file in the dist directory that themekit watches.
 * @param file
 */
const updateFile = async (file: string): Promise<void> => {
  try {
    const fileKey = replaceFileKey(file);
    const source = await fs.readFile(file);
    const target = await fs.readFile(fileKey);

    if (Buffer.compare(source, target) !== 0) {
      await fs.writeFile(fileKey, source);
      await linkStyles(fileKey);
      return;
    }

    return;
  } catch (err) {
    return console.error(err);
  }
};

/**
 * Removes the file from the dist directory that themekit watches.
 * @param file - File src + name
 */
const removeFile = async (file: string): Promise<void> => {
  try {
    const fileKey = replaceFileKey(file);
    const isFileExists = await fs.pathExists(fileKey);

    if (isFileExists === true) {
      return await fs.remove(fileKey);
    }

    return;
  } catch (err) {
    return console.error(err);
  }
};

export {
  addFile,
  updateFile,
  removeFile
};
