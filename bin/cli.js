#! /usr/bin/env node

const cli = require('commander');
const { createWorkingDirectory, downloadThemeFiles, initializeWatchers } = require('./lib/index'); 
const { getVersion } = require('./lib/version/version');
const { initializeTheme } = require('./lib/init/init');
const { buildDistFiles } = require('./lib/build/build');
const { compileLocales } = require('./lib/locales/locales');
const deployThemeFiles = require('./lib/deploy/deploy');
const configureYML = require('./lib/configure/configure');

cli
  .command('convert')
  .description('Convert the currently downloaded Shopify Theme to use Mango workflow')
  .action(() => createWorkingDirectory());

cli
  .command('build')
  .description('Build the current working directory into a ready to distribute theme')
  .action(() => buildDistFiles());

cli
  .command('deploy')
  .description('Deploy the dist folder to your current theme')
  .option('-d, --dir <dir>', 'Which directory to deploy', 'shop/dist')
  .option('-l, --allow-live', 'Allow deployment to the live theme')
  .option('-e, --env <env>', 'Which environment to use', 'development')
  .option('-n, --new <name>', 'Specify whether or not to generate a new theme to deploy to')
  .option('-v, --verbose', 'Specify if you want Verbose output')
  .option('-i, --ignores <file>', 'The ignores file you want to use')
  .action((options) => deployThemeFiles(options));

cli
  .command('config')
  .description('Configure/provision your environment with a config.yml file')
  .requiredOption('-t, --themeid <theme>', 'Theme ID')
  .requiredOption('-p, --password <password>', 'Private App Password')
  .requiredOption('-s, --store <store>', '.myshopify.com Store URL')
  .option('-i, --ignores <file>', 'Optional ignores file')
  .option('-e, --env <env>', 'Optional environment, default is development')
  .option('-d, --dir <dir>', 'Optional directory, default is shop/dist')
  .action(options => configureYML(options));


cli
  .command('download')
  .description('Download the Shopify Theme Files from the currently defined theme in config.yml')
  .action(() => downloadThemeFiles());

cli
  .command('locales')
  .description('Compiles your locales folder with the configured localization defined in shop/src/dev/locales.config.json')
  .action(() => compileLocales())

cli
  .command('watch')
  .description('Start watching theme files')
  .action(() => initializeWatchers())

cli
  .command('init')
  .option('-r, --recommended', 'Use the recommended directory setup, prefilled babel, eslint & webpack configs.', false)
  .option('-s, --standard', 'Use the recommended directory setup, prefilled babel, eslint & webpack configs.', false)
  .description('Initialize Working Directory')
  .action(command => initializeTheme(command));

cli.version(getVersion(), '-V --version', 'Output the version number');
cli.parse(process.argv);
