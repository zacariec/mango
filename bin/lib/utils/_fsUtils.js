const path = require('path');
const fs = require('fs-extra');
const _Directorys = require('./_directorys');

const cloneDirectory = async (directoryToCopy = _Directorys.productionRoot, directoryDestination = _Directorys.developmentRoot) => {
    try {
        await fs.copy(directoryToCopy, directoryDestination);
    } catch (err) {
        return console.error(err);
    }
};

const moveFile = async (fileToMove, fileDestination) => {
    try {
        await fs.move(fileToMove, `${fileDestination}/${path.basename(fileToMove)}`)
    } catch (err) {
        return console.error(err);
    }
};

module.exports = {
    cloneDirectory,
    moveFile
};
