const path = require('path');
const fs = require('fs-extra');
const chokidar = require('chokidar');
const glob = require('fast-glob');
const ora = require('ora');
const _Directorys = require('../utils/_directorys');
const { moveFile, createRecursiveDirectory, checkWorkingDirectory } = require('../utils/_fsUtils');

const createDevDirectory = async () => {
  const spinner = ora('Creating working directory').start();
  const directoriesToMake = [
      _Directorys.shopRoot,
      _Directorys.productionRoot,
      _Directorys.developmentRoot,
      _Directorys.devRoot,
      _Directorys.staticRoot,
      _Directorys.scriptsRoot,
      _Directorys.scriptsModuleRoot,
      _Directorys.stylesRoot,
      _Directorys.stylesBase,
      _Directorys.stylesComponents,
      _Directorys.stylesMixins,
      _Directorys.stylesSections,
      _Directorys.stylesTemplates,
      _Directorys.stylesTypography,
      _Directorys.stylesVariables,
      _Directorys.fontsRoot,
      _Directorys.imagesRoot,
      _Directorys.layoutRoot,
      _Directorys.templatesRoot,
      _Directorys.customersRoot,
      _Directorys.snippetsRoot,
      _Directorys.sectionsRoot,
      _Directorys.configRoot,
      _Directorys.localesRoot,
  ];

  try {
    await createRecursiveDirectory(directoriesToMake);
    if (await checkWorkingDirectory() === true) spinner.succeed('Finished creating working directory');
  } catch (err) {
    spinner.fail('Failed creating working directory, maybe it already exists');
    return console.error(err);
  }
};

const moveAssets = async (array, directory, type) => {
  const spinner = ora(`Moving ${type} to working directory`).start();
  try {
    const files = await glob(array);
    for (const [index, file] of files.entries()) {
      await moveFile(file, directory);
      if (index === files.length - 1) spinner.succeed(`Finished moving ${type} to working directory`);
    }
  } catch (err) {
    spinner.fail(`Error moving ${type} to working directory`);
    return console.error(err);
  }
};

const moveAssetsToDev = async () => {

  const spinner = ora('Moving assets folder into new working directory').start();

  const watcher = chokidar.watch(path.resolve('./shop/src/assets'));

  watcher.on('unlink', async () => {
    try {
      const directory = await fs.readdir(path.resolve('./shop/src/assets'));
      if (directory.length === 0) {
        await fs.remove(path.resolve('./shop/src/assets'));
        spinner.succeed('Removed assets folder from working directory');
        watcher.close();
      }
    } catch (err) {
      spinner.fail('Error removing assets directory from working directory');
      watcher.close();
      return console.error(err);
    }
  });

  watcher.on('error', err => watcher.close(err));

  try {
    const images = [path.resolve('./shop/src/assets/*.jpg'), path.resolve('./shop/src/assets/*.png'), path.resolve('./shop/src/assets/*.gif'), path.resolve('./shop/src/assets/*.webp'), path.resolve('./shop/src/assets/*.svg'), path.resolve('./shop/src/assets/*.svg.liquid')];
    const fonts = [path.resolve('./shop/src/assets/*.otf'), path.resolve('./shop/src/assets/*.ttf'), path.resolve('./shop/src/assets/*.eot'), path.resolve('./shop/src/assets/*.woff'), path.resolve('./shop/src/assets/*.woff2'), path.resolve('./shop/src/assets/*.txt'), path.resolve('./shop/src/assets/*.txt.liquid')];
    const styles = [path.resolve('./shop/src/assets/*.css'), path.resolve('./shop/src/assets/*.scss'), path.resolve('./shop/src/assets/*.css.liquid'), path.resolve('./shop/src/assets/*.scss.liquid')];
    const scripts = [path.resolve('./shop/src/assets/*.js'), path.resolve('./shop/src/assets/*.js.liquid')];

    await moveAssets(images, _Directorys.imagesRoot, 'images');
    await moveAssets(fonts, _Directorys.fontsRoot, 'fonts');
    await moveAssets(styles, _Directorys.stylesRoot, 'styles');
    await moveAssets(scripts, _Directorys.scriptsRoot, 'scripts');

  } catch (err) {
    return console.error(err);
  }

};

module.exports = {
  createDevDirectory,
  moveAssetsToDev
};
