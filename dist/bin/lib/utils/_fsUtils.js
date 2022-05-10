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
exports.moveFile = exports.cloneDirectory = exports.checkDistDirectory = exports.checkWorkingDirectory = exports.createRecursiveDirectory = exports.createDirectory = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const _directorys_1 = __importDefault(require("./_directorys"));
const _sleep_1 = __importDefault(require("./_sleep"));
const createDirectory = (directoryToMake) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, _sleep_1.default)(250);
    if ((yield fs_extra_1.default.pathExists(directoryToMake)) === false)
        yield fs_extra_1.default.mkdir(directoryToMake);
});
exports.createDirectory = createDirectory;
const createRecursiveDirectory = (directoriesToMake) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, _sleep_1.default)(250);
        for (const dir of directoriesToMake)
            yield createDirectory(dir);
    }
    catch (err) {
        return console.error(err);
    }
});
exports.createRecursiveDirectory = createRecursiveDirectory;
const checkWorkingDirectory = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, _sleep_1.default)(250);
    if ((yield fs_extra_1.default.pathExists(_directorys_1.default.shopRoot)) === true
        && (yield fs_extra_1.default.pathExists(_directorys_1.default.productionRoot)) === true
        && (yield fs_extra_1.default.pathExists(_directorys_1.default.developmentRoot)) === true
        && (yield fs_extra_1.default.pathExists(_directorys_1.default.devRoot)) === true
        && (yield fs_extra_1.default.pathExists(_directorys_1.default.scriptsRoot)) === true
        && (yield fs_extra_1.default.pathExists(_directorys_1.default.scriptsModuleRoot)) === true
        && (yield fs_extra_1.default.pathExists(_directorys_1.default.stylesRoot)) === true
        && (yield fs_extra_1.default.pathExists(_directorys_1.default.fontsRoot)) === true
        && (yield fs_extra_1.default.pathExists(_directorys_1.default.imagesRoot)) === true)
        return true;
});
exports.checkWorkingDirectory = checkWorkingDirectory;
const checkDistDirectory = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, _sleep_1.default)(250);
    if ((yield fs_extra_1.default.pathExists(_directorys_1.default.shopRoot)) === true
        && (yield fs_extra_1.default.pathExists(_directorys_1.default.productionRoot)) === true
        && (yield fs_extra_1.default.pathExists(_directorys_1.default.distAssetsRoot)) === true
        && (yield fs_extra_1.default.pathExists(_directorys_1.default.distConfigRoot)) === true
        && (yield fs_extra_1.default.pathExists(_directorys_1.default.distLayoutRoot)) === true
        && (yield fs_extra_1.default.pathExists(_directorys_1.default.distLocalesRoot)) === true
        && (yield fs_extra_1.default.pathExists(_directorys_1.default.distSectionsRoot)) === true
        && (yield fs_extra_1.default.pathExists(_directorys_1.default.distSnippetsRoot)) === true
        && (yield fs_extra_1.default.pathExists(_directorys_1.default.distTemplatesRoot)) === true)
        return true;
});
exports.checkDistDirectory = checkDistDirectory;
const cloneDirectory = (directoryToCopy = _directorys_1.default.productionRoot, directoryDestination = _directorys_1.default.developmentRoot) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, _sleep_1.default)(250);
    yield fs_extra_1.default.copy(directoryToCopy, directoryDestination);
});
exports.cloneDirectory = cloneDirectory;
const moveFile = (fileToMove, fileDestination) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, _sleep_1.default)(250);
    yield fs_extra_1.default.move(fileToMove, `${fileDestination}/${path_1.default.basename(fileToMove)}`);
});
exports.moveFile = moveFile;
