import path from 'path';
import spawn from 'cross-spawn';
import ora from 'ora';
import { createDevDirectory } from '../convert/convert';
import { cloneDirectory, createRecursiveDirectory, checkDistDirectory } from '../utils/_fsUtils';
import _Directories from '../utils/_directorys';
import { spawnCallback, handleError } from '../utils/_logUtils';

const createDistDirectory = async (): Promise<void> => {
  const spinner = ora('Creating distribution directory').start();
  const directoriesToMake = [
    _Directories.distAssetsRoot,
    _Directories.distConfigRoot,
    _Directories.distLayoutRoot,
    _Directories.distLocalesRoot,
    _Directories.distSectionsRoot,
    _Directories.distSnippetsRoot,
    _Directories.distTemplatesRoot,
  ];

  try {
    await createRecursiveDirectory(directoriesToMake);
    if (await checkDistDirectory() === true) spinner.succeed('Finished creating distribution directory');
  } catch (err) {
    spinner.fail('Failed creating distribution directory, maybe it already exists');
    return console.error(err);
  }
}

const installDependencies = (): void => {
  const spinner = ora('Installing peer dependencies').start();

  const command = spawn('npm', ['install', '-D']);

  command.stdout.on('data', data => spawnCallback(data, false));
  command.stderr.on('data', data => spawnCallback(data, false));

  command.stdout.on('end', () => spinner.succeed('Installed project dependencies successfully, please update your package.json if needed.'));
  command.on('error', err => {
    spinner.fail('Error installing project dependencies');
    handleError(err.errno, err);
  });
};

const initializeTheme = async (): Promise<void> => {
  try {
    const settings = _Directories.configSettings;
    await createDevDirectory();
    await createDistDirectory();

    await cloneDirectory(path.resolve(settings), path.resolve('./'));
    installDependencies();

  } catch (err) {
    return console.error(err);
  }
};

export default initializeTheme;
