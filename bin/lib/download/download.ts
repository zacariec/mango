import path from 'path';
import spawn from 'cross-spawn';
import fs from 'fs-extra';
import { spawnCallback, handleError } from '../utils/_logUtils';
import _Directories from '../utils/_directorys';

const downloadThemeFiles = async (): Promise<void> => {
  try {
    const isDirExists = await fs.pathExists(path.resolve('./shop/dist'));
    if (isDirExists === false) await fs.mkdir(path.resolve('./shop/dist'), { recursive: true });

    const command = spawn(_Directories.theme, ['download', `--dir=${path.resolve('./shop/dist')}`], { stdio: 'pipe' });
    command.stdout.on('data', data => spawnCallback(data, true));
    command.stderr.on('data', data => spawnCallback(data, true));
    command.on('error', err => handleError(err.errno, err));
  } catch (err) {
    return console.error(err);
  }
};

export default downloadThemeFiles;
