#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const lib_1 = require("./lib");
const version_1 = __importDefault(require("./lib/version/version"));
const build_1 = __importDefault(require("./lib/build/build"));
const locales_1 = __importDefault(require("./lib/locales/locales"));
const init_1 = __importDefault(require("./lib/init/init"));
const download_1 = __importDefault(require("./lib/download/download"));
const deploy_1 = __importDefault(require("./lib/deploy/deploy"));
const configure_1 = __importDefault(require("./lib/configure/configure"));
const updateData_1 = __importDefault(require("./lib/updateData/updateData"));
const install_1 = __importDefault(require("./lib/install/install"));
commander_1.default
    .command('convert')
    .description('Convert the currently downloaded Shopify Theme to use Mango workflow')
    .action(() => (0, lib_1.createWorkingDirectory)());
commander_1.default
    .command('build')
    .description('Build the current working directory into a ready to distribute theme')
    .option('-u, --update-config [id]', 'Specify whether or not to update the settings_data.json file with a config from the live or specified theme id.')
    .action((options) => (0, build_1.default)(options));
commander_1.default
    .command('deploy')
    .description('Deploy the dist folder to your current theme')
    .option('-d, --dir <dir>', 'Which directory to deploy', 'shop/dist')
    .option('-l, --allow-live', 'Allow deployment to the live theme')
    .option('-e, --env <env>', 'Which environment to use', 'development')
    .option('-n, --new <name>', 'Specify whether or not to generate a new theme to deploy to')
    .option('-v, --verbose', 'Specify if you want Verbose output')
    .option('-i, --ignores <file>', 'The ignores file you want to use')
    .action((options) => (0, deploy_1.default)(options));
commander_1.default
    .command('config')
    .description('Configure/provision your environment with a config.yml file')
    .requiredOption('-t, --themeid <theme>', 'Theme ID')
    .requiredOption('-p, --password <password>', 'Private App Password')
    .requiredOption('-s, --store <store>', '.myshopify.com Store URL')
    .option('-i, --ignores <file>', 'Optional ignores file')
    .option('-e, --env <env>', 'Optional environment, default is development')
    .option('-d, --dir <dir>', 'Optional directory, default is shop/dist')
    .action(options => (0, configure_1.default)(options));
commander_1.default
    .command('update-data')
    .description('Update settings_data.json with the published theme settings_data.json')
    .option('-id, --themeId [id]', 'Specify whether or not to update the settings_data.json file with a config from the live or specified theme id.')
    .action((options) => (0, updateData_1.default)(options));
commander_1.default
    .command('download')
    .description('Download the Shopify Theme Files from the currently defined theme in config.yml')
    .action(() => (0, download_1.default)());
commander_1.default
    .command('locales')
    .description('Compiles your locales folder with the configured localization defined in shop/src/dev/locales.config.json')
    .action(() => (0, locales_1.default)());
commander_1.default
    .command('watch')
    .description('Start watching theme files')
    .action(() => (0, lib_1.initializeWatchers)());
commander_1.default
    .command('install')
    .description('Install Theme kit from Shopify')
    .action(() => (0, install_1.default)());
commander_1.default
    .command('init')
    .description('Initialize Working Directory')
    .action(() => (0, init_1.default)());
commander_1.default.version((0, version_1.default)(), '-V --version', 'Output the version number');
commander_1.default.parse(process.argv);
