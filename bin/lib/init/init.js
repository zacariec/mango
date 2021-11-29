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

const installDependencies = () => {
  const spinner = ora('Installing peer dependencies').start();

  const command = spawn('npm', ['install', '-D']);

  command.stdout.on('data', data => spawnCallback(data, false));
  command.stderr.on('data', data => {
    spawnCallback(data, false);
  });

  command.stdout.on('end', () => spinner.succeed('Installed project dependencies successfully, please update your package.json if needed.'));
  command.on('error', err => {
    spinner.fail('Error installing project dependencies');
    handleError(err.errno, err);
  });
};

module.exports = initializeTheme = async () => {
  try {
    const settings = _Directorys.configSettings;
    await createDevDirectory();
    await createDistDirectory();

    await cloneDirectory(path.resolve(settings), path.resolve('./'));
    installDependencies();

  } catch (err) {
    return console.error(err);
  }
};
