"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const global_modules_path_1 = require("global-modules-path");
const _Directories = {
    theme: path_1.default.join(`${(0, global_modules_path_1.getPath)('@shopackify/mango')}/bin/theme`, process.platform === 'win32' ? 'theme.exe' : 'theme'),
    shopRoot: path_1.default.resolve('./shop'),
    developmentRoot: path_1.default.resolve('./shop/src'),
    productionRoot: path_1.default.resolve('./shop/dist'),
    devRoot: path_1.default.resolve('./shop/src/dev'),
    staticRoot: path_1.default.resolve('./shop/src/dev/static'),
    stylesRoot: path_1.default.resolve('./shop/src/dev/styles'),
    stylesBase: path_1.default.resolve('./shop/src/dev/styles/base'),
    stylesComponents: path_1.default.resolve('./shop/src/dev/styles/components'),
    stylesMixins: path_1.default.resolve('./shop/src/dev/styles/mixins'),
    stylesSections: path_1.default.resolve('./shop/src/dev/styles/sections'),
    stylesTemplates: path_1.default.resolve('./shop/src/dev/styles/templates'),
    stylesTypography: path_1.default.resolve('./shop/src/dev/styles/typography'),
    stylesVariables: path_1.default.resolve('./shop/src/dev/styles/variables'),
    scriptsRoot: path_1.default.resolve('./shop/src/dev/js'),
    scriptsModuleRoot: path_1.default.resolve('./shop/src/dev/js/modules'),
    fontsRoot: path_1.default.resolve('./shop/src/dev/fonts'),
    imagesRoot: path_1.default.resolve('./shop/src/dev/images'),
    layoutRoot: path_1.default.resolve('./shop/src/layout'),
    templatesRoot: path_1.default.resolve('./shop/src/templates'),
    customersRoot: path_1.default.resolve('./shop/src/templates/customers'),
    snippetsRoot: path_1.default.resolve('./shop/src/snippets'),
    sectionsRoot: path_1.default.resolve('./shop/src/sections'),
    configRoot: path_1.default.resolve('./shop/src/config'),
    localesRoot: path_1.default.resolve('./shop/src/locales'),
    assetsRoot: path_1.default.resolve('./shop/src/assets'),
    distLayoutRoot: path_1.default.resolve('./shop/dist/layout'),
    distTemplatesRoot: path_1.default.resolve('./shop/dist/templates'),
    distCustomersRoot: path_1.default.resolve('./shop/dist/templates/customers'),
    distSnippetsRoot: path_1.default.resolve('./shop/dist/snippets'),
    distSectionsRoot: path_1.default.resolve('./shop/dist/sections'),
    distConfigRoot: path_1.default.resolve('./shop/dist/config'),
    distLocalesRoot: path_1.default.resolve('./shop/dist/locales'),
    distAssetsRoot: path_1.default.resolve('./shop/dist/assets'),
    configSettings: `${(0, global_modules_path_1.getPath)('@shopackify/mango')}/bin/settings`
};
exports.default = _Directories;
