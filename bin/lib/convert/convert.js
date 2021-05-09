const path = require('path');
const fs = require('fs-extra');
const chokidar = require('chokidar');
const glob = require('fast-glob');
const _Directorys = require('../utils/_directorys');
const { moveFile } = require('../utils/_fsUtils');

const createDevDirectory = async () => {
    try {
        if(await fs.pathExists(_Directorys.devRoot) === false) await fs.mkdir(_Directorys.devRoot);
        if(await fs.pathExists(_Directorys.scriptsRoot) === false) {
            await fs.mkdir(_Directorys.scriptsRoot);
            await fs.createFile(`${_Directorys.scriptsRoot}/app.js`);
        }
        if(await fs.pathExists(_Directorys.scriptsModuleRoot) === false) await fs.mkdir(_Directorys.scriptsModuleRoot);
        if(await fs.pathExists(_Directorys.scriptsVendorRoot) === false) await fs.mkdir(_Directorys.scriptsVendorRoot);
        if(await fs.pathExists(_Directorys.stylesRoot) === false) await fs.mkdir(_Directorys.stylesRoot);
        if(await fs.pathExists(_Directorys.fontsRoot) === false) await fs.mkdir(_Directorys.fontsRoot);
        if(await fs.pathExists(_Directorys.imagesRoot) === false) await fs.mkdir(_Directorys.imagesRoot);
    } catch (err) {
        return console.error(err);
    }
};

const moveAssetsToDev = async () => {
    
    const watcher = chokidar.watch(path.resolve('./shop/src/assets'));
    
    watcher.on('unlink', async () => {
        try {
            const directory = await fs.readdir(path.resolve('./shop/src/assets'));
            if(directory.length === 0) {
                await fs.remove(path.resolve('./shop/src/assets'));
                watcher.close();
            }
        } catch (err) {
            watcher.close();
            return console.error(err);
        }
    });

    watcher.on('error', err => watcher.close(err));

    try {
        const images = await glob([path.resolve('./shop/src/assets/*.jpg'), path.resolve('./shop/src/assets/*.png'), path.resolve('./shop/src/assets/*.gif'), path.resolve('./shop/src/assets/*.webp'), path.resolve('./shop/src/assets/*.svg'), path.resolve('./shop/src/assets/*.svg.liquid')]);
        const fonts = await glob([path.resolve('./shop/src/assets/*.otf'), path.resolve('./shop/src/assets/*.ttf'), path.resolve('./shop/src/assets/*.eot'), path.resolve('./shop/src/assets/*.woff'), path.resolve('./shop/src/assets/*.woff2'), path.resolve('./shop/src/assets/*.txt'), path.resolve('./shop/src/assets/*.txt.liquid')]);
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
        
    } catch (err) {
        return console.error(err);
    }
    
};

module.exports = {
    createDevDirectory,
    moveAssetsToDev
};
