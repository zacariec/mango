const path = require('path');
const fs = require('fs-extra');
const chokidar = require('chokidar');
const glob = require('fast-glob');
const _Directorys = require('../utils/_directorys');
const { moveFile } = require('../utils/_fsUtils');

const createDevDirectory = () => {
    fs.mkdir(_Directorys.devRoot, err => {
        if(err) console.error(err);
        fs.mkdir(_Directorys.scriptsRoot, err => {
            if(err) console.error(err);
            fs.mkdir(_Directorys.scriptsModuleRoot, err => {
                if(err) console.error(err);
                fs.mkdir(_Directorys.scriptsVendorRoot, err => {
                    if(err) console.error(err);
                    fs.mkdir(_Directorys.fontsRoot, err => {
                        if(err) console.error(err);
                        fs.mkdir(_Directorys.imagesRoot, err => {
                            if(err) console.error(err);
                        });
                    });
                });
            });
        });
    });
};

const moveAssetsToDev = async () => {
    
    const watcher = chokidar.watch(path.resolve('./shop/src/assets'));
    
    watcher.on('unlink', () => {
        fs.readdir(path.resolve('./shop/src/assets'), (err, directory) => {
            if(err) console.error(err);
            if(directory.length === 0) {
                fs.remove(path.resolve('./shop/src/assets'), err => {
                    if(err) watcher.emit('error');
                    watcher.close();
                })
            }
        });
    });

    watcher.on('error', err => watcher.close(err));

    const images = await glob([path.resolve('./shop/src/assets/*.jpg'), path.resolve('./shop/src/assets/*.png'), path.resolve('./shop/src/assets/*.gif'), path.resolve('./shop/src/assets/*.webp'), path.resolve('./shop/src/assets/*.svg')]);
    const fonts = await glob([path.resolve('./shop/src/assets/*.otf'), path.resolve('./shop/src/assets/*.ttf'), path.resolve('./shop/src/assets/*.eot'), path.resolve('./shop/src/assets/*.woff'), path.resolve('./shop/src/assets/*.woff2'), path.resolve('./shop/src/assets/*.txt')]);
    const styles = await glob([path.resolve('./shop/src/assets/*.css'), path.resolve('./shop/src/assets/*.scss'), path.resolve('./shop/src/assets/*.css.liquid'), path.resolve('./shop/src/assets/*.scss.liquid')]);
    const scripts = await glob([path.resolve('./shop/src/assets/*.js'), path.resolve('./shop/src/assets/*.js.liquid')]);

    for(const image of images) {
        moveFile(image, _Directorys.imagesRoot);
    }

    for(const font of fonts) {
        moveFile(font, _Directorys.fontsRoot);
    }

    for(const style of styles) {
        moveFile(style, _Directorys.stylesRoot);
    }

    for(const script of scripts) {
        moveFile(script, _Directorys.scriptsModuleRoot);
    }
    
};

module.exports = {
    createDevDirectory,
    moveAssetsToDev
};
