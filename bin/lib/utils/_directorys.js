const path = require('path');

module.exports = {
    developmentRoot: path.resolve('./shop/src'),
    productionRoot: path.resolve('./shop/dist'),
    devRoot: path.resolve('./shop/src/dev'),
    stylesRoot: path.resolve('./shop/src/dev/styles'),
    scriptsRoot: path.resolve('./shop/src/dev/js'),
    scriptsModuleRoot: path.resolve('./shop/src/dev/js/modules'),
    scriptsVendorRoot: path.resolve('./shop/src/dev/js/vendor'),
    fontsRoot: path.resolve('./shop/src/dev/fonts'),
    imagesRoot: path.resolve('./shop/src/dev/images'),
    layoutRoot: path.resolve('./shop/src/layout'),
    templatesRoot: path.resolve('./shop/src/templates'),
    snippetsRoot: path.resolve('./shop/src/snippets'),
    sectionsRoot: path.resolve('./shop/src/sections'),
    configRoot: path.resolve('./shop/src/config'),
    localesRoot: path.resolve('./shop/src/locales'),
    assetsRoot: path.resolve('./shop/src/assets')
};
