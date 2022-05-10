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
const fs_extra_1 = __importDefault(require("fs-extra"));
const _logUtils_1 = require("../utils/_logUtils");
const _directorys_1 = __importDefault(require("../utils/_directorys"));
const downloadThemeFiles = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isDirExists = yield fs_extra_1.default.pathExists(path_1.default.resolve('./shop/dist'));
        if (isDirExists === false)
            yield fs_extra_1.default.mkdir(path_1.default.resolve('./shop/dist'), { recursive: true });
        const command = (0, cross_spawn_1.default)(_directorys_1.default.theme, ['download', `--dir=${path_1.default.resolve('./shop/dist')}`], { stdio: 'pipe' });
        command.stdout.on('data', data => (0, _logUtils_1.spawnCallback)(data, true));
        command.stderr.on('data', data => (0, _logUtils_1.spawnCallback)(data, true));
        command.on('error', err => (0, _logUtils_1.handleError)(err.errno, err));
    }
    catch (err) {
        return console.error(err);
    }
});
exports.default = downloadThemeFiles;
