#!/usr/bin/env node
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
import linkStyles from "./lib/style-linking/styleLinking";

// build command to build the src folder into the dist folder for distribution.
cli
  .command('build')
  .description('Build the current working directory into a ready to distribute theme')
  .option(
    '-env, --environment [environment]',
    'Specify whether or not to update the settings_data.json file with a config from the live or specified theme id.'
  )
  .option('-id --id [themeid]', 'A specified theme id to get the settings from, otherwise the published theme in the environment by default')
  .action((options): Promise<void> => buildDistFiles(options));

// initialize the config.yml file with the passed values.
cli
  .command('config')
  .description('Configure/provision your environment with a config.yml file')
  .requiredOption('-t, --themeid <theme>', 'Theme ID')
  .requiredOption('-p, --password <password>', 'Private App Password')
  .requiredOption('-s, --store <store>', '.myshopify.com Store URL')
  .option('-i, --ignores <file>', 'Optional ignores file')
  .option('-e, --env <env>', 'Optional environment, default is development')
  .option('-d, --dir <dir>', 'Optional directory, default is shop/dist')
  .action((options): Promise<void> => configureYML(options));

// convert a project from dist to src to scaffold any theme into the correct format useable by mango.
cli
  .command('convert')
  .description('Convert the currently downloaded Shopify Theme to use Mango workflow')
  .action((): Promise<void> => createWorkingDirectory());

// deploy the dist folder to a specified environment.
cli
  .command('deploy')
  .description('Deploy the dist folder to your current theme')
  .option('-d, --dir <dir>', 'Which directory to deploy', 'shop/dist')
  .option('-l, --allow-live', 'Allow deployment to the live theme')
  .option('-e, --env <env>', 'Which environment to use', 'development')
  .option('-n, --new <name>', 'Specify whether or not to generate a new theme to deploy to')
  .option('-v, --verbose', 'Specify if you want Verbose output')
  .option('-i, --ignores <file>', 'The ignores file you want to use')
  .action((options): Promise<void> => deployThemeFiles(options));

// download theme files from the top level environment
// TODO: Pass an --env option here to allow downloading themes from there.
cli
  .command('download')
  .description('Download the Shopify Theme Files from the currently defined theme in config.yml')
  .action((): Promise<void> => downloadThemeFiles());

// Manually run style-link command as a fallback when it's not automatic.
cli
  .command('style-link')
  .description('Inline all of your linked stylesheets to their respective file')
  .action((): Promise<void> => linkStyles(null));

// initialize a mango scaffold.
cli
  .command('init')
  .description('Initialize Working Directory')
  .action(() => initializeTheme());

// manual fallback command to install themekit to the /usr/bin directory for use with mango.
cli
  .command('install')
  .description('Install Theme kit from Shopify')
  .action(() => install());

// compiles locales.
// TODO: This doesn't really solve many problems with continuous development & deployment.
cli
  .command('locales')
  .description('Compiles your locales folder with the configured localization defined in shop/src/dev/locales.config.json')
  .action((): Promise<void> => compileLocales());

// manual command to pull the settings_data.json file from the specified environment.
cli
  .command('update-data')
  .description('Update settings_data.json with the published theme settings_data.json')
  .option(
    '-env, --environment [environment]',
    'Specify whether or not to update the settings_data.json file with a config from the live or specified theme id.'
  )
  .option('-id --id [themeid]', 'A specified theme id to get the settings from, otherwise the published theme in the environment by default')
  .action((options): Promise<void> => updateData(options));


cli
  .command('watch')
  .option('-e, --env [environment]',
  'Specify environment from the config.yml fil, wrap in quotes to pass multiple: -e "development1 development2"'
  )
  .description('Start watching theme files')
  .action((options): Promise<void> => initializeWatchers(options));


cli.version(getVersion(), '-V --version', 'Output the version number');
cli.parse(process.argv);
