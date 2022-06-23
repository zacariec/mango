import BinWrapper from 'bin-wrapper';
import ora from 'ora';
import { getPath } from 'global-modules-path';

const install = async (): Promise<void> => {
  const spinner = ora('Installing Theme Kit package').start();
  const themeKitConfig = {
    baseURL: 'https://shopify-themekit.s3.amazonaws.com',
    version: '1.3.0',
    destination: `${getPath('@shopackify/mango')}/bin/theme`,
    binName: process.platform === 'win32' ? 'theme.exe' : 'theme'
  };

  // credit to @shopify/theme-kit node wrapper, for the install command.
  const pkg = new BinWrapper()
      .src(`${themeKitConfig.baseURL}/v${themeKitConfig.version}/darwin-amd64/theme`, 'darwin')
      .src(`${themeKitConfig.baseURL}/v${themeKitConfig.version}/linux-386/theme`, 'linux')
      .src(`${themeKitConfig.baseURL}/v${themeKitConfig.version}/linux-amd64/theme`, 'linux', 'x64')
      .src(`${themeKitConfig.baseURL}/v${themeKitConfig.version}/windows-386/theme.exe`, 'win32')
      .src(`${themeKitConfig.baseURL}/v${themeKitConfig.version}/windows-amd64/theme.exe`, 'win32', 'x64')
      .dest(themeKitConfig.destination)
      .use(themeKitConfig.binName);

  try {
    spinner.succeed(`Installed Theme Kit package to: ${pkg.path()}`);
    await pkg.run(['version']);
  } catch (err) {
    spinner.fail('Error installing Theme Kit package, contact the developer; maybe Shopify updated their bucket?');
    console.error(err);
  }
};

// install command, gets run on postinstall of mango and can be ran from the cli as backup.
export default install;
