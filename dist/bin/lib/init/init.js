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
const path_1 = __importDefault(require("path"));
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const ora_1 = __importDefault(require("ora"));
const convert_1 = require("../convert/convert");
const _fsUtils_1 = require("../utils/_fsUtils");
const _directorys_1 = __importDefault(require("../utils/_directorys"));
const _logUtils_1 = require("../utils/_logUtils");
const createDistDirectory = () => __awaiter(void 0, void 0, void 0, function* () {
    const spinner = (0, ora_1.default)('Creating distribution directory').start();
    const directoriesToMake = [
        _directorys_1.default.distAssetsRoot,
        _directorys_1.default.distConfigRoot,
        _directorys_1.default.distLayoutRoot,
        _directorys_1.default.distLocalesRoot,
        _directorys_1.default.distSectionsRoot,
        _directorys_1.default.distSnippetsRoot,
        _directorys_1.default.distTemplatesRoot,
    ];
    try {
        yield (0, _fsUtils_1.createRecursiveDirectory)(directoriesToMake);
        if ((yield (0, _fsUtils_1.checkDistDirectory)()) === true)
            spinner.succeed('Finished creating distribution directory');
    }
    catch (err) {
        spinner.fail('Failed creating distribution directory, maybe it already exists');
        return console.error(err);
    }
});
const installDependencies = () => {
    const spinner = (0, ora_1.default)('Installing peer dependencies').start();
    const command = (0, cross_spawn_1.default)('npm', ['install', '-D']);
    command.stdout.on('data', data => (0, _logUtils_1.spawnCallback)(data, false));
    command.stderr.on('data', data => (0, _logUtils_1.spawnCallback)(data, false));
    command.stdout.on('end', () => spinner.succeed('Installed project dependencies successfully, please update your package.json if needed.'));
    command.on('error', err => {
        spinner.fail('Error installing project dependencies');
        (0, _logUtils_1.handleError)(err.errno, err);
    });
};
const initializeTheme = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = _directorys_1.default.configSettings;
        yield (0, convert_1.createDevDirectory)();
        yield createDistDirectory();
        yield (0, _fsUtils_1.cloneDirectory)(path_1.default.resolve(settings), path_1.default.resolve('./'));
        installDependencies();
    }
    catch (err) {
        return console.error(err);
    }
});
exports.default = initializeTheme;
