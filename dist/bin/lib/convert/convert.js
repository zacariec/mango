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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveAssetsToDev = exports.createDevDirectory = void 0;
const path = __importStar(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const chokidar = __importStar(require("chokidar"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const ora_1 = __importDefault(require("ora"));
const _directorys_1 = __importDefault(require("../utils/_directorys"));
const _fsUtils_1 = require("../utils/_fsUtils");
const createDevDirectory = () => __awaiter(void 0, void 0, void 0, function* () {
    const spinner = (0, ora_1.default)('Creating working directory').start();
    const directoriesToMake = [
        _directorys_1.default.shopRoot,
        _directorys_1.default.productionRoot,
        _directorys_1.default.developmentRoot,
        _directorys_1.default.devRoot,
        _directorys_1.default.staticRoot,
        _directorys_1.default.scriptsRoot,
        _directorys_1.default.scriptsModuleRoot,
        _directorys_1.default.stylesRoot,
        _directorys_1.default.stylesBase,
        _directorys_1.default.stylesComponents,
        _directorys_1.default.stylesMixins,
        _directorys_1.default.stylesSections,
        _directorys_1.default.stylesTemplates,
        _directorys_1.default.stylesTypography,
        _directorys_1.default.stylesVariables,
        _directorys_1.default.fontsRoot,
        _directorys_1.default.imagesRoot,
        _directorys_1.default.layoutRoot,
        _directorys_1.default.templatesRoot,
        _directorys_1.default.customersRoot,
        _directorys_1.default.snippetsRoot,
        _directorys_1.default.sectionsRoot,
        _directorys_1.default.configRoot,
        _directorys_1.default.localesRoot,
    ];
    try {
        yield (0, _fsUtils_1.createRecursiveDirectory)(directoriesToMake);
        if ((yield (0, _fsUtils_1.checkWorkingDirectory)()) === true)
            spinner.succeed('Finished creating working directory');
    }
    catch (err) {
        spinner.fail('Failed creating working directory, maybe it already exists');
        return console.error(err);
    }
});
exports.createDevDirectory = createDevDirectory;
const moveAssets = (array, directory, type) => __awaiter(void 0, void 0, void 0, function* () {
    const spinner = (0, ora_1.default)(`Moving ${type} to working directory`).start();
    try {
        const files = yield (0, fast_glob_1.default)(array);
        for (const [index, file] of files.entries()) {
            yield (0, _fsUtils_1.moveFile)(file, directory);
            if (index === files.length - 1)
                spinner.succeed(`Finished moving ${type} to working directory`);
        }
    }
    catch (err) {
        spinner.fail(`Error moving ${type} to working directory`);
        return console.error(err);
    }
});
const moveAssetsToDev = () => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const spinner = (0, ora_1.default)('Moving assets folder into new working directory').start();
    const watcher = chokidar.watch(path.resolve('./shop/src/assets'));
    watcher.on('unlink', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const directory = yield fs_extra_1.default.readdir(path.resolve('./shop/src/assets'));
            if (directory.length === 0) {
                yield fs_extra_1.default.remove(path.resolve('./shop/src/assets'));
                spinner.succeed('Removed assets folder from working directory');
                yield watcher.close();
            }
        }
        catch (err) {
            spinner.fail('Error removing assets directory from working directory');
            yield watcher.close();
            return console.error(err);
        }
    }));
    watcher.on('error', () => watcher.close());
    try {
        const assets = [
            {
                type: 'images',
                root: _directorys_1.default.imagesRoot,
                assets: [
                    path.resolve('./shop/src/assets/*.jpg'),
                    path.resolve('./shop/src/assets/*.png'),
                    path.resolve('./shop/src/assets/*.gif'),
                    path.resolve('./shop/src/assets/*.webp'),
                    path.resolve('./shop/src/assets/*.svg'),
                    path.resolve('./shop/src/assets/*.svg.liquid'),
                ]
            },
            {
                type: 'fonts',
                root: _directorys_1.default.fontsRoot,
                assets: [
                    path.resolve('./shop/src/assets/*.otf'),
                    path.resolve('./shop/src/assets/*.ttf'),
                    path.resolve('./shop/src/assets/*.eot'),
                    path.resolve('./shop/src/assets/*.woff'),
                    path.resolve('./shop/src/assets/*.woff2'),
                    path.resolve('./shop/src/assets/*.txt'),
                    path.resolve('./shop/src/assets/*.txt.liquid')
                ],
            },
            {
                type: 'styles',
                root: _directorys_1.default.stylesRoot,
                assets: [
                    path.resolve('./shop/src/assets/*.css'),
                    path.resolve('./shop/src/assets/*.scss'),
                    path.resolve('./shop/src/assets/*.css.liquid'),
                    path.resolve('./shop/src/assets/*.scss.liquid'),
                ],
            },
            {
                type: 'scripts',
                root: _directorys_1.default.scriptsRoot,
                assets: [
                    path.resolve('./shop/src/assets/*.js'),
                    path.resolve('./shop/src/assets/*.js.liquid'),
                ],
            },
        ];
        try {
            for (var assets_1 = __asyncValues(assets), assets_1_1; assets_1_1 = yield assets_1.next(), !assets_1_1.done;) {
                const asset = assets_1_1.value;
                yield moveAssets(asset.assets, asset.root, asset.type);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (assets_1_1 && !assets_1_1.done && (_a = assets_1.return)) yield _a.call(assets_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    catch (err) {
        return console.error(err);
    }
});
exports.moveAssetsToDev = moveAssetsToDev;
