#! /usr/bin/env node

const cli = require('commander');
const { downloadThemeFiles } = require('./lib/index'); 

cli
  .command('download')
  .description('Download the Shopify Theme Files from the currently defined theme in config.yml')
  .action(() => {
    downloadThemeFiles();
  });

cli.parse(process.argv);
