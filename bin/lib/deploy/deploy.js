const spawn = require('cross-spawn');
const { spawnCallback, handleError } = require('../utils/_logUtils');
const createTheme = require('../shopify/create');

const deployCommand = (parameters) => {
  const command = spawn('theme', ['deploy', ...parameters], { stdio: 'pipe' });
  command.stdout.on('data', data => spawnCallback(data, true));
  command.stderr.on('data', data => spawnCallback(data, false));
  command.on('error', err => handleError(err.errno, err));
};

module.exports = deployThemeFiles = async (options) => {
  const parameters = [
    `--dir=${options.dir}`,
    options.allowLive ? `--allow-live` : ``,
  ];

  if (options.new) {
    const theme = await createTheme(options.new);
    parameters.push(`--env=${theme.theme.name}`);
    deployCommand(parameters);
  } else {
    parameters.push(`--env=${options.env}`);
    deployCommand(parameters);
  }
};