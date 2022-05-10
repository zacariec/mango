import * as path from 'path';
import fs from 'fs-extra';
import * as chokidar from 'chokidar';
import glob from 'fast-glob';
import ora from'ora';
import _Directories from '../utils/_directorys';
import { moveFile, createRecursiveDirectory, checkWorkingDirectory } from '../utils/_fsUtils';

const createDevDirectory = async (): Promise<void> => {
  const spinner = ora('Creating working directory').start();
  const directoriesToMake = [
    _Directories.shopRoot,
    _Directories.productionRoot,
    _Directories.developmentRoot,
    _Directories.devRoot,
    _Directories.staticRoot,
    _Directories.scriptsRoot,
    _Directories.scriptsModuleRoot,
    _Directories.stylesRoot,
    _Directories.stylesBase,
    _Directories.stylesComponents,
    _Directories.stylesMixins,
    _Directories.stylesSections,
    _Directories.stylesTemplates,
    _Directories.stylesTypography,
    _Directories.stylesVariables,
    _Directories.fontsRoot,
    _Directories.imagesRoot,
    _Directories.layoutRoot,
    _Directories.templatesRoot,
    _Directories.customersRoot,
    _Directories.snippetsRoot,
    _Directories.sectionsRoot,
    _Directories.configRoot,
    _Directories.localesRoot,
  ];

  try {
    await createRecursiveDirectory(directoriesToMake);
    if (await checkWorkingDirectory() === true) spinner.succeed('Finished creating working directory');
  } catch (err) {
    spinner.fail('Failed creating working directory, maybe it already exists');
    return console.error(err);
  }
};

const moveAssets = async (array, directory, type): Promise<void> => {
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

const moveAssetsToDev = async (): Promise<void> => {
  const spinner = ora('Moving assets folder into new working directory').start();
  const watcher = chokidar.watch(path.resolve('./shop/src/assets'));

  watcher.on('unlink', async (): Promise<void> => {
    try {
      const directory = await fs.readdir(path.resolve('./shop/src/assets'));
      if (directory.length === 0) {
        await fs.remove(path.resolve('./shop/src/assets'));
        spinner.succeed('Removed assets folder from working directory');
        await watcher.close();
      }
    } catch (err) {
      spinner.fail('Error removing assets directory from working directory');
      await watcher.close();
      return console.error(err);
    }
  });
  watcher.on('error', (): Promise<void> => watcher.close());

  try {
    const assets = [
      {
        type: 'images',
        root: _Directories.imagesRoot,
        assets: [
          path.resolve('./shop/src/assets/*.jpg'),
          path.resolve('./shop/src/assets/*.png'),
          path.resolve('./shop/src/assets/*.gif'),
          path.resolve('./shop/src/assets/*.webp'),
          path.resolve('./shop/src/assets/*.svg'),
          path.resolve('./shop/src/assets/*.svg.liquid'),
        ]
      },
      {
        type: 'fonts',
        root: _Directories.fontsRoot,
        assets: [
          path.resolve('./shop/src/assets/*.otf'),
          path.resolve('./shop/src/assets/*.ttf'),
          path.resolve('./shop/src/assets/*.eot'),
          path.resolve('./shop/src/assets/*.woff'),
          path.resolve('./shop/src/assets/*.woff2'),
          path.resolve('./shop/src/assets/*.txt'),
          path.resolve('./shop/src/assets/*.txt.liquid')
        ],
      },
      {
        type: 'styles',
        root: _Directories.stylesRoot,
        assets: [
          path.resolve('./shop/src/assets/*.css'),
          path.resolve('./shop/src/assets/*.scss'),
          path.resolve('./shop/src/assets/*.css.liquid'),
          path.resolve('./shop/src/assets/*.scss.liquid'),
        ],
      },
      {
        type: 'scripts',
        root: _Directories.scriptsRoot,
        assets: [
          path.resolve('./shop/src/assets/*.js'),
          path.resolve('./shop/src/assets/*.js.liquid'),
        ],
      },
    ];

    for await (const asset of assets) {
      await moveAssets(asset.assets, asset.root, asset.type);
    }

  } catch (err) {
    return console.error(err);
  }

};

export {
  createDevDirectory,
  moveAssetsToDev
};
