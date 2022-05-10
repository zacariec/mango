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
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const _logUtils_1 = require("../utils/_logUtils");
const create_1 = __importDefault(require("../shopify/create"));
const _directorys_1 = __importDefault(require("../utils/_directorys"));
const deployCommand = (parameters) => {
    const command = (0, cross_spawn_1.default)(_directorys_1.default.theme, ['deploy', ...parameters], { stdio: 'pipe' });
    command.stdout.on('data', data => (0, _logUtils_1.spawnCallback)(data, true));
    command.stderr.on('data', data => (0, _logUtils_1.spawnCallback)(data, false));
    command.on('error', err => (0, _logUtils_1.handleError)(err.errno, err));
};
const deployThemeFiles = ({ dir, file, allowLive, verbose, name, env }) => __awaiter(void 0, void 0, void 0, function* () {
    const parameters = [
        `--dir=${dir}`,
        file ? `--ignores=${file}` : ``,
        allowLive ? `--allow-live` : ``,
        verbose ? `-v` : ``,
    ];
    if (name) {
        const theme = yield (0, create_1.default)(name);
        parameters.push(`--env=${theme.theme.name}`);
        deployCommand(parameters);
    }
    else {
        parameters.push(`--env=${env}`);
        deployCommand(parameters);
    }
});
exports.default = deployThemeFiles;
