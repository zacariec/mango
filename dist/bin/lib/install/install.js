"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bin_wrapper_1 = __importDefault(require("bin-wrapper"));
const ora_1 = __importDefault(require("ora"));
const global_modules_path_1 = require("global-modules-path");
const install = () => __awaiter(void 0, void 0, void 0, function* () {
    const spinner = (0, ora_1.default)('Installing Theme Kit package').start();
    const themeKitConfig = {
        baseURL: 'https://shopify-themekit.s3.amazonaws.com',
        version: '1.3.0',
        destination: `${(0, global_modules_path_1.getPath)('@shopackify/mango')}/bin/theme`,
        binName: process.platform === 'win32' ? 'theme.exe' : 'theme'
    };
    // credit to @shopify/theme-kit node wrapper, for the install command.
    const pkg = new bin_wrapper_1.default()
        .src(`${themeKitConfig.baseURL}/v${themeKitConfig.version}/darwin-amd64/theme`, 'darwin')
        .src(`${themeKitConfig.baseURL}/v${themeKitConfig.version}/linux-386/theme`, 'linux')
        .src(`${themeKitConfig.baseURL}/v${themeKitConfig.version}/linux-amd64/theme`, 'linux', 'x64')
        .src(`${themeKitConfig.baseURL}/v${themeKitConfig.version}/windows-386/theme.exe`, 'win32')
        .src(`${themeKitConfig.baseURL}/v${themeKitConfig.version}/windows-amd64/theme.exe`, 'win32', 'x64')
        .dest(themeKitConfig.destination)
        .use(themeKitConfig.binName);
    try {
        spinner.succeed(`Installed Theme Kit package to: ${pkg.path()}`);
        yield pkg.run(['version']);
    }
    catch (err) {
        spinner.fail('Error installing Theme Kit package, contact the developer; maybe Shopify updated their bucket?');
        console.error(err);
    }
});
// install command, gets run on postinstall of mango and can be ran from the cli as backup.
exports.default = install;
