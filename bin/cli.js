#! /usr/bin/env node

const cli = require('commander');
const { createWorkingDirectory, downloadThemeFiles, initializeWatchers } = require('./lib/index'); 
const { initializeTheme } = require('./lib/init/init');
const { buildDistFiles } = require('./lib/build/build');

cli
  .command('convert')
  .description('Convert the currently downloaded Shopify Theme to use Shopackify workflow')
  .action(() => createWorkingDirectory());

cli
  .command('build')
  .description('Build the current working directory into a ready to distribute theme')
  .action(() => buildDistFiles());

cli
  .command('download')
  .description('Download the Shopify Theme Files from the currently defined theme in config.yml')
  .action(() => downloadThemeFiles());

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

cli.parse(process.argv);
