import spawn from 'cross-spawn';
import { spawnCallback, handleError } from '../utils/_logUtils';
import createTheme from '../shopify/create';
import _Directories from '../utils/_directorys';
import { ThemeOptions } from "../../../types/types";

const deployCommand = (parameters) => {
  const command = spawn(_Directories.theme, ['deploy', ...parameters], { stdio: 'pipe' });

  command.stdout.on('data', data => spawnCallback(data, true));
  command.stderr.on('data', data => spawnCallback(data, false));
  command.on('error', err => handleError(err.errno, err));
};

const deployThemeFiles = async ({ dir, file, allowLive, verbose, name, env }: ThemeOptions): Promise<void> => {
  const parameters = [
    `--dir=${dir}`,
    file ? `--ignores=${file}` : ``,
    allowLive ? `--allow-live` : ``,
    verbose ? `-v`: ``,
  ];

  if (name) {
    const theme = await createTheme(name, null);
    parameters.push(`--env=${theme.theme.name}`);
    deployCommand(parameters);
  } else {
    parameters.push(`--env=${env}`);
    deployCommand(parameters);
  }
};

export default deployThemeFiles;
