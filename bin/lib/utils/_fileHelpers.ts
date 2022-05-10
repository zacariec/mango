import fs from 'fs-extra';
// TODO: Probably need some sort of error handling in here at some stage.
// Need to see how well it works to begin with.

const replaceFileKey = (fileKey) => {
  let key = fileKey;

  key.replace(/src(.*?)/, 'dist');
  key = key.replace(/dev(.*?)/, 'assets');
  key = key.replace(/images(.*?)/, '');
  key = key.replace(/fonts(.*?)/, '');
  key = key.replace(/static(.*?)/, '');

  return key;
};

const addFile = async (e) => {
  try {
    const fileKey = replaceFileKey(e);
    const source = await fs.readFile(e);

    await fs.writeFile(fileKey, source);
  } catch (err) {
    return console.error(err);
  }
};

const updateFile = async (e) => {
  try {
    const fileKey = replaceFileKey(e);
    const source = await fs.readFile(e);
    const target = await fs.readFile(fileKey);
    if(Buffer.compare(source, target) !== 0) await fs.writeFile(fileKey, source);
  } catch (err) {
    return console.error(err);
  }
};

const removeFile = async (e) => {
  try {
    const fileKey = replaceFileKey(e);
    const isFileExists = await fs.pathExists(fileKey);
    if(isFileExists === true) await fs.remove(fileKey);
  } catch (err) {
    return console.error(err);
  }
};

export {
  addFile,
  updateFile,
  removeFile
};
