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
const ora_1 = __importDefault(require("ora"));
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const _directorys_1 = __importDefault(require("../utils/_directorys"));
const _fsUtils_1 = require("../utils/_fsUtils");
const _logUtils_1 = require("../utils/_logUtils");
const liveReload_1 = require("../reload/liveReload");
const _sleep_1 = __importDefault(require("../utils/_sleep"));
const updateData_1 = __importDefault(require("../updateData/updateData"));
const buildDistDirectory = () => __awaiter(void 0, void 0, void 0, function* () {
    const spinner = (0, ora_1.default)('Creating distribution directory').start();
    const directoriesToMake = [
        _directorys_1.default.productionRoot,
        _directorys_1.default.distAssetsRoot,
        _directorys_1.default.distConfigRoot,
        _directorys_1.default.distLayoutRoot,
        _directorys_1.default.distLocalesRoot,
        _directorys_1.default.distSectionsRoot,
        _directorys_1.default.distSnippetsRoot,
        _directorys_1.default.distTemplatesRoot,
        _directorys_1.default.distCustomersRoot,
    ];
    try {
        for (const dir of directoriesToMake)
            yield (0, _fsUtils_1.createDirectory)(dir);
        spinner.succeed('Finished creating distribution directory');
    }
    catch (err) {
        spinner.fail('Failed creating distribution directory, maybe it already exists');
        return console.error(err);
    }
});
const copyToDist = (directory, output, type) => __awaiter(void 0, void 0, void 0, function* () {
    const spinner = (0, ora_1.default)(`Moving ${type} to ${output}`);
    try {
        yield (0, _fsUtils_1.cloneDirectory)(directory, output);
        spinner.succeed(`Finished moving ${type} to ${output}`);
    }
    catch (err) {
        spinner.fail(`Error moving ${type} to ${output}`);
        return console.error(err);
    }
});
const buildDistFiles = (options) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const spinner = (0, ora_1.default)('Building distribution folder.').start();
    try {
        if (options.updateConfig)
            yield (0, updateData_1.default)(options);
        const directoriesToCopy = [
            {
                from: _directorys_1.default.staticRoot,
                to: _directorys_1.default.distAssetsRoot,
                name: 'Static',
            },
            {
                from: _directorys_1.default.imagesRoot,
                to: _directorys_1.default.distAssetsRoot,
                name: 'Images',
            },
            {
                from: _directorys_1.default.fontsRoot,
                to: _directorys_1.default.distAssetsRoot,
                name: 'Fonts',
            },
            {
                from: _directorys_1.default.configRoot,
                to: _directorys_1.default.distConfigRoot,
                name: 'Config',
            },
            {
                from: _directorys_1.default.layoutRoot,
                to: _directorys_1.default.distLayoutRoot,
                name: 'Layout',
            },
            {
                from: _directorys_1.default.localesRoot,
                to: _directorys_1.default.distLocalesRoot,
                name: 'Locales',
            },
            {
                from: _directorys_1.default.sectionsRoot,
                to: _directorys_1.default.distSectionsRoot,
                name: 'Sections',
            },
            {
                from: _directorys_1.default.snippetsRoot,
                to: _directorys_1.default.distSnippetsRoot,
                name: 'Snippets',
            },
            {
                from: _directorys_1.default.templatesRoot,
                to: _directorys_1.default.distTemplatesRoot,
                name: 'Templates',
            },
            {
                from: _directorys_1.default.customersRoot,
                to: _directorys_1.default.distCustomersRoot,
                name: 'Customers',
            }
        ];
        yield (0, liveReload_1.removeLiveReload)();
        yield buildDistDirectory();
        try {
            for (var directoriesToCopy_1 = __asyncValues(directoriesToCopy), directoriesToCopy_1_1; directoriesToCopy_1_1 = yield directoriesToCopy_1.next(), !directoriesToCopy_1_1.done;) {
                const directory = directoriesToCopy_1_1.value;
                yield copyToDist(directory.from, directory.to, directory.name);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (directoriesToCopy_1_1 && !directoriesToCopy_1_1.done && (_a = directoriesToCopy_1.return)) yield _a.call(directoriesToCopy_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        spinner.succeed('Finished building distribution folder');
        yield (0, _sleep_1.default)(500);
        const webPackSpinner = (0, ora_1.default)('Packing styles and scripts with Webpack').start();
        const command = (0, cross_spawn_1.default)('npx', ['webpack', '--config', `webpack.production.config`]);
        command.stdout.on('data', data => {
            (0, _logUtils_1.spawnCallback)(data, false);
            if (data.toString().includes('ERROR')) {
                webPackSpinner.warn('There was an error in Webpack, maybe it still compiled - check the logging output above');
                process.exit(1);
            }
            else if (data.toString().includes('compiled successfully')) {
                webPackSpinner.succeed('Finished packing output files');
                process.exit(1);
            }
        });
        command.stderr.on('data', data => {
            (0, _logUtils_1.spawnCallback)(data, false);
            webPackSpinner.warn('There was an error in Webpack, maybe it still compiled - check the logging output above');
        });
        command.stdout.on('end', () => webPackSpinner.succeed('Finished packing styles and scripts'));
        command.on('error', err => {
            webPackSpinner.fail('Error packing styles and scripts');
            (0, _logUtils_1.handleError)(err.errno, err);
        });
    }
    catch (err) {
        spinner.fail('Error building distribution folder');
        return console.error(err);
    }
});
exports.default = buildDistFiles;
