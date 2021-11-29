const fs = require('fs-extra');
// TODO: Probably need some sort of error handling in here at some stage.
// Need to see how well it works to begin with.
const addFile = async (e, watcher) => {  
  try {
    let fileKey = e.replace(/src(.*?)/, 'dist');
    fileKey = fileKey.replace(/dev(.*?)/, 'assets');
    fileKey = fileKey.replace(/images(.*?)/, '');
    fileKey = fileKey.replace(/fonts(.*?)/, '');
    fileKey = fileKey.replace(/static(.*?)/, '');
    const source = await fs.readFile(e);
    await fs.writeFile(fileKey, source);
  } catch (err) {
    return console.error(err);
  }
};

const updateFile = async (e, watcher) => {       
  try {
    let fileKey = e.replace(/src(.*?)/, 'dist');
    fileKey = fileKey.replace(/dev(.*?)/, 'assets');
    fileKey = fileKey.replace(/images(.*?)/, '');
    fileKey = fileKey.replace(/fonts(.*?)/, '');
    fileKey = fileKey.replace(/static(.*?)/, '');
    const source = await fs.readFile(e);
    const target = await fs.readFile(fileKey);
    if(Buffer.compare(source, target) !== 0) await fs.writeFile(fileKey, source);
  } catch (err) {
    return console.error(err);
  }
};

const removeFile = async (e, watcher) => {
  try {
    let fileKey = e.replace(/src/g, 'dist');
    fileKey = fileKey.replace(/dev(.*?)/, 'assets');
    fileKey = fileKey.replace(/images(.*?)/, '');
    fileKey = fileKey.replace(/fonts(.*?)/, '');
    fileKey = fileKey.replace(/static(.*?)/, '');
    const isFileExists = await fs.pathExists(fileKey);
    if(isFileExists === true) await fs.remove(fileKey);
  } catch (err) {
    return console.error(err);
  }
};

module.exports = {
  addFile,
  updateFile,
  removeFile
};
