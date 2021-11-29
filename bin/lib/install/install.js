const BinWrapper = require('bin-wrapper');
const ora = require('ora');
const { getPath } = require('global-modules-path');

// install command, gets run on postinstall of mango and can be ran from the cli as backup.
module.exports = install = async () => {
  const spinner = ora('Installing Theme Kit package').start();
  const themeKitConfig = {
    baseURL: 'https://shopify-themekit.s3.amazonaws.com',
    version: '1.3.0',
    destination: `${getPath('@shopackify/mango')}/bin/theme`,
    binName: process.platform === 'win32' ? 'theme.exe' : 'theme'
  };

  // credit to @shopify/theme-kit node wrapper, for the install command.
  const package = new BinWrapper()
    .src(`${themeKitConfig.baseURL}/v${themeKitConfig.version}/darwin-amd64/theme`, 'darwin')
    .src(`${themeKitConfig.baseURL}/v${themeKitConfig.version}/linux-386/theme`, 'linux')
    .src(`${themeKitConfig.baseURL}/v${themeKitConfig.version}/linux-amd64/theme`, 'linux', 'x64')
    .src(`${themeKitConfig.baseURL}/v${themeKitConfig.version}/windows-386/theme.exe`, 'win32')
    .src(`${themeKitConfig.baseURL}/v${themeKitConfig.version}/windows-amd64/theme.exe`, 'win32', 'x64')
    .dest(themeKitConfig.destination)
    .use(themeKitConfig.binName);

  try {
    spinner.succeed(`Installed Theme Kit package to: ${package.path()}`);
    await package.run(['version']);
  } catch (err) {
    spinner.fail('Error installing Theme Kit package, contact the developer; maybe Shopify updated their bucket?');
    console.error(err);
  }
};
