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
exports.removeFile = exports.updateFile = exports.addFile = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
// TODO: Probably need some sort of error handling in here at some stage.
// Need to see how well it works to begin with.
const replaceFileKey = (fileKey) => {
    let key = fileKey;
    key.replace(/src(.*?)/, 'dist');
    key = key.replace(/dev(.*?)/, 'assets');
    key = key.replace(/images(.*?)/, '');
    key = key.replace(/fonts(.*?)/, '');
    key = key.replace(/static(.*?)/, '');
    return key;
};
const addFile = (e) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileKey = replaceFileKey(e);
        const source = yield fs_extra_1.default.readFile(e);
        yield fs_extra_1.default.writeFile(fileKey, source);
    }
    catch (err) {
        return console.error(err);
    }
});
exports.addFile = addFile;
const updateFile = (e) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileKey = replaceFileKey(e);
        const source = yield fs_extra_1.default.readFile(e);
        const target = yield fs_extra_1.default.readFile(fileKey);
        if (Buffer.compare(source, target) !== 0)
            yield fs_extra_1.default.writeFile(fileKey, source);
    }
    catch (err) {
        return console.error(err);
    }
});
exports.updateFile = updateFile;
const removeFile = (e) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileKey = replaceFileKey(e);
        const isFileExists = yield fs_extra_1.default.pathExists(fileKey);
        if (isFileExists === true)
            yield fs_extra_1.default.remove(fileKey);
    }
    catch (err) {
        return console.error(err);
    }
});
exports.removeFile = removeFile;
