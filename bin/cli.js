#! /usr/bin/env node

const cli = require('commander');
const { createWorkingDirectory, downloadThemeFiles, initalizeWatchers, liveReload } = require('./lib/index'); 

cli
  .command('convert')
  .description('Convert the currently downloaded Shopify Theme to use Shopackify workflow')
  .action(() => createWorkingDirectory());

cli
  .command('download')
  .description('Download the Shopify Theme Files from the currently defined theme in config.yml')
  .action(() => downloadThemeFiles());

cli
  .command('watch')
  .description('Start watching theme files')
  .action(() => initalizeWatchers())

cli
  .command('reload')
  .description('live reload')
  .action(() => liveReload())

cli.parse(process.argv);
