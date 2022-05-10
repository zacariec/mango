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
const ora_1 = __importDefault(require("ora"));
const empty_leaves_1 = __importDefault(require("./empty-leaves"));
const defaultsDeep_1 = __importDefault(require("lodash/defaultsDeep"));
const cloneDeep_1 = __importDefault(require("lodash/cloneDeep"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const _directorys_1 = __importDefault(require("../utils/_directorys"));
const localesConfigJsonFile = 'locales.config.json';
const ORA_NAMESPACE = 'Locale Compilation';
const bufferToJson = buffer => {
    try {
        return JSON.parse(buffer.toString());
    }
    catch (e) {
        return {};
    }
};
const writeLocale = (locale, content) => fs_extra_1.default.writeJSON(`${_directorys_1.default.localesRoot}/${locale}.json`, content, { spaces: 2 });
const compileLocale = (locale, existingFiles, translations, blanks) => __awaiter(void 0, void 0, void 0, function* () {
    const spinner = (0, ora_1.default)(`${ORA_NAMESPACE} - Compiling ${locale}`).start();
    // check if exists
    const targetLocale = existingFiles.find(file => file === `${locale}.json`);
    let existingJson = {};
    if (targetLocale) {
        spinner.text = `Found existing file for ${locale}, merging it's contents as default.`;
        const targetFileBuffer = yield fs_extra_1.default.readFile(`${_directorys_1.default.localesRoot}/${targetLocale}`);
        existingJson = bufferToJson(targetFileBuffer);
    }
    try {
        const isDefault = locale.includes('default');
        const combined = (0, defaultsDeep_1.default)({}, existingJson, (isDefault ? translations : blanks));
        spinner.text = `Writing ${locale}`;
        yield writeLocale(locale, combined);
        spinner.succeed(`${locale} done`);
    }
    catch (e) {
        spinner.fail(`${ORA_NAMESPACE} - Error compiling for ${locale}`);
        return console.error(e);
    }
});
const compileLocales = () => __awaiter(void 0, void 0, void 0, function* () {
    const spinner = (0, ora_1.default)().start(`${ORA_NAMESPACE} - Start`);
    try {
        const existingFiles = yield fs_extra_1.default.readdir(_directorys_1.default.localesRoot);
        const localesConfigJsonBuffer = yield fs_extra_1.default.readFile(`${_directorys_1.default.devRoot}/${localesConfigJsonFile}`);
        const { locales, translations } = bufferToJson(localesConfigJsonBuffer);
        const blankTranslations = (0, empty_leaves_1.default)((0, cloneDeep_1.default)(translations));
        yield Promise.all(locales.map(locale => compileLocale(locale, existingFiles, translations, blankTranslations)));
        spinner.succeed(`${ORA_NAMESPACE} - Complete`);
    }
    catch (e) {
        spinner.fail(`${ORA_NAMESPACE} - Error`);
        return console.error(e);
    }
});
exports.default = compileLocales;
