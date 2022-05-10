"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWebpack = exports.initializeThemekit = exports.initializeWorkingDirectory = void 0;
const path_1 = __importDefault(require("path"));
const chokidar_1 = __importDefault(require("chokidar"));
const WebSocket = __importStar(require("ws"));
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const _directorys_1 = __importDefault(require("../utils/_directorys"));
const _logUtils_1 = require("../utils/_logUtils");
const _fileHelpers_1 = require("../utils/_fileHelpers");
const initializeWorkingDirectory = () => {
    const watcher = chokidar_1.default.watch(_directorys_1.default.developmentRoot, {
        ignored: [
            path_1.default.resolve('./shop/src/dev/js'),
            path_1.default.resolve('./shop/src/dev/styles'),
            path_1.default.resolve('./shop/src/assets'),
            path_1.default.resolve('./shop/dist'),
        ]
    });
    watcher.on('change', _fileHelpers_1.updateFile);
    watcher.on('add', _fileHelpers_1.addFile);
    watcher.on('unlink', _fileHelpers_1.removeFile);
};
exports.initializeWorkingDirectory = initializeWorkingDirectory;
const initializeThemekit = () => {
    const wss = new WebSocket.Server({ port: 9000 });
    let client = undefined;
    wss.on('connection', ws => {
        client = ws;
    });
    const liveReloadCallback = (data) => (typeof client != 'undefined' && data.includes('Updated')) ? client.send('event') : null;
    return new Promise((resolve) => {
        (0, cross_spawn_1.default)(_directorys_1.default.theme, ['open'], { stdio: 'pipe' });
        const command = (0, cross_spawn_1.default)(_directorys_1.default.theme, ['watch', `--dir=${path_1.default.resolve('./shop/dist')}`], { stdio: 'pipe' });
        command.stdout.on('data', data => {
            (0, _logUtils_1.spawnCallback)(data, false, liveReloadCallback);
            if (data.toString().includes('Watching for file changes'))
                resolve();
        });
        command.stderr.on('data', data => (0, _logUtils_1.spawnCallback)(data, false));
        command.on('error', err => (0, _logUtils_1.handleError)(err.errno, err));
    });
};
exports.initializeThemekit = initializeThemekit;
const initializeWebpack = () => {
    return new Promise(resolve => {
        const command = (0, cross_spawn_1.default)('npx', ['webpack'], { stdio: 'pipe' });
        command.stdout.on('data', data => (0, _logUtils_1.spawnCallback)(data, false));
        command.stderr.on('data', data => (0, _logUtils_1.spawnCallback)(data, false));
        command.on('error', err => (0, _logUtils_1.handleError)(err.errno, err));
        resolve();
    });
};
exports.initializeWebpack = initializeWebpack;
