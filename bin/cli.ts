#! /usr/bin/env node

import cli from 'commander';
import { createWorkingDirectory, initializeWatchers } from './lib';
import getVersion from './lib/version/version';
import buildDistFiles from './lib/build/build';
import compileLocales from './lib/locales/locales';
import initializeTheme from './lib/init/init';
import downloadThemeFiles from './lib/download/download';
import deployThemeFiles from './lib/deploy/deploy';
import configureYML from './lib/configure/configure';
import updateData from './lib/updateData/updateData';
import install from './lib/install/install';

cli
  .command('convert')
  .description('Convert the currently downloaded Shopify Theme to use Mango workflow')
  .action(() => createWorkingDirectory());

cli
  .command('build')
  .description('Build the current working directory into a ready to distribute theme')
  .option(
    '-u, --update-config [id]',
    'Specify whether or not to update the settings_data.json file with a config from the live or specified theme id.'
  )
  .action((options) => buildDistFiles(options));

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
  .command('update-data')
  .description('Update settings_data.json with the published theme settings_data.json')
  .option(
    '-id, --themeId [id]',
    'Specify whether or not to update the settings_data.json file with a config from the live or specified theme id.'
  )
  .action((options) => updateData(options));

cli
  .command('download')
  .description('Download the Shopify Theme Files from the currently defined theme in config.yml')
  .action(() => downloadThemeFiles());

cli
  .command('locales')
  .description('Compiles your locales folder with the configured localization defined in shop/src/dev/locales.config.json')
  .action(() => compileLocales());

cli
  .command('watch')
  .description('Start watching theme files')
  .action(() => initializeWatchers());

cli
  .command('install')
  .description('Install Theme kit from Shopify')
  .action(() => install());

cli
  .command('init')
  .description('Initialize Working Directory')
  .action(() => initializeTheme());

cli.version(getVersion(), '-V --version', 'Output the version number');
cli.parse(process.argv);
