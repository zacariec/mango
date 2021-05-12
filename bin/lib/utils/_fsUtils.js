const path = require('path');
const fs = require('fs-extra');
const _Directorys = require('./_directorys');
const sleep = require('./_sleep');

const createDirectory = async (directoryToMake) => {
    await sleep(250);
    if(await fs.pathExists(directoryToMake) === false) await fs.mkdir(directoryToMake);
};

const checkWorkingDirectory = async () => {
    await sleep(250);
    if(await fs.pathExists(_Directorys.shopRoot) === true
    && await fs.pathExists(_Directorys.productionRoot) === true
    && await fs.pathExists(_Directorys.developmentRoot) === true
    && await fs.pathExists(_Directorys.devRoot) === true
    && await fs.pathExists(_Directorys.scriptsRoot) === true
    && await fs.pathExists(_Directorys.scriptsModuleRoot) === true
    && await fs.pathExists(_Directorys.scriptsVendorRoot) === true
    && await fs.pathExists(_Directorys.stylesRoot) === true
    && await fs.pathExists(_Directorys.fontsRoot) === true
    && await fs.pathExists(_Directorys.imagesRoot) === true) return true;
};

const cloneDirectory = async (directoryToCopy = _Directorys.productionRoot, directoryDestination = _Directorys.developmentRoot) => {
    await sleep(250);
    await fs.copy(directoryToCopy, directoryDestination);
};

const moveFile = async (fileToMove, fileDestination) => {
    await sleep(250);
    await fs.move(fileToMove, `${fileDestination}/${path.basename(fileToMove)}`)
};

module.exports = {
    createDirectory,
    checkWorkingDirectory,
    cloneDirectory,
    moveFile
};
