const path = require('path');
const fs = require('fs-extra');
const _Directorys = require('./_directorys');

const cloneDirectory = async (directoryToCopy = _Directorys.productionRoot, directoryDestination = _Directorys.developmentRoot) => {
    return fs.copy(directoryToCopy, directoryDestination);
};

const moveFile = (fileToMove, fileDestination) => {
    return fs.move(fileToMove, `${fileDestination}/${path.basename(fileToMove)}`, err => {
        if(err) console.error(err);
    });
};

module.exports = {
    cloneDirectory,
    moveFile
};
