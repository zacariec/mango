const path = require('path');
const spawn = require('cross-spawn');
const ora = require('ora');
const { createDevDirectory } = require('../convert/convert');
const { cloneDirectory, createRecursiveDirectory, checkDistDirectory } = require('../utils/_fsUtils');
const _Directorys = require('../utils/_directorys');
const { spawnCallback, handleError } = require('../utils/_logUtils');

const createDistDirectory = async () => {
  const spinner = ora('Creating distribution directory').start();
  const directoriesToMake = [
    _Directorys.distAssetsRoot,
    _Directorys.distConfigRoot,
    _Directorys.distLayoutRoot,
    _Directorys.distLocalesRoot,
    _Directorys.distSectionsRoot,
    _Directorys.distSnippetsRoot,
    _Directorys.distTemplatesRoot,
  ];

  try {
    await createRecursiveDirectory(directoriesToMake);
    if (await checkDistDirectory() === true) spinner.succeed('Finished creating distribution directory');
  } catch (err) {
    spinner.fail('Failed creating distribution directory, maybe it already exists');
    return console.error(err);
  }
}

const installDependencies = (type) => {
  const spinner = ora('Installing peer dependencies').start();
  if (type.recommended === true || type === true) {
    const command = spawn('npm', ['install', '-D']);
    command.stdout.on('data', data => spawnCallback(data, false));
    command.stderr.on('data', data => {
      spawnCallback(data, false);
    });
    command.stdout.on('end', () => spinner.succeed('Installed standard dependencies successfully, please update your package.json if needed.'));
    command.on('error', err => {
      spinner.fail('Error installing standard dependencies');
      handleError(err.errno, err);
    });
  } else {
    const command = spawn('npm', ['install', '-D']);
    command.stdout.on('data', data => spawnCallback(data, false));
    command.stderr.on('data', data => {
      spawnCallback(data, false);
    });
    command.stdout.on('end', () => spinner.succeed('Installed standard dependencies successfully, please update your package.json if needed.'));
    command.on('error', err => {
      spinner.fail('Error installing standard dependencies');
      handleError(err.errno, err);
    });
  }
};

const initializeTheme = async (type = true) => {
  try {
    const settings = (type.recommended === true || type === true) ? _Directorys.recommendedSettings : _Directorys.standardSettings;
    await createDevDirectory();
    await createDistDirectory();

    await cloneDirectory(path.resolve(settings), path.resolve('./'));
    installDependencies(type);

  } catch (err) {
    return console.error(err);
  }
};


module.exports = {
  initializeTheme,
};