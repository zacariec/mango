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
exports.getVersion = exports.initializeWatchers = exports.downloadThemeFiles = exports.deployThemeFile = exports.createWorkingDirectory = void 0;
const _fsUtils_1 = require("./utils/_fsUtils");
const convert_1 = require("./convert/convert");
const deploy_1 = __importDefault(require("./deploy/deploy"));
exports.deployThemeFile = deploy_1.default;
const download_1 = __importDefault(require("./download/download"));
exports.downloadThemeFiles = download_1.default;
const liveReload_js_1 = require("./reload/liveReload.js");
const watch_1 = require("./watch/watch");
const version_1 = __importDefault(require("./version/version"));
exports.getVersion = version_1.default;
// TODO: Handle console.errors(), probably prettify output with
// chalk and a handler that takes in a callback etc - across all modules.
const createWorkingDirectory = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, _fsUtils_1.cloneDirectory)();
    yield (0, convert_1.createDevDirectory)();
    yield (0, convert_1.moveAssetsToDev)();
});
exports.createWorkingDirectory = createWorkingDirectory;
const initializeWatchers = () => {
    (0, watch_1.initializeThemekit)()
        .then(() => (0, liveReload_js_1.liveReload)())
        .then(() => (0, watch_1.initializeWebpack)())
        .then(() => (0, watch_1.initializeWorkingDirectory)())
        .catch(err => console.error(err));
};
exports.initializeWatchers = initializeWatchers;
