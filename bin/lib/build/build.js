const ora = require('ora');
const spawn = require('cross-spawn');
const _Directorys = require('../utils/_directorys');
const { cloneDirectory, createDirectory } = require('../utils/_fsUtils');
const { spawnCallback, handleError } = require('../utils/_logUtils');
const sleep = require('../utils/_sleep');

const buildDistDirectory = async () => {
    const spinner = ora('Creating distribution directory').start();

    const directoriesToMake = [
        _Directorys.productionRoot,
        _Directorys.distAssetsRoot,
        _Directorys.distConfigRoot,
        _Directorys.distLayoutRoot,
        _Directorys.distLocalesRoot,
        _Directorys.distSectionsRoot,
        _Directorys.distSnippetsRoot,
        _Directorys.distTemplatesRoot
    ];

    try {
        for (const dir of directoriesToMake) await createDirectory(dir);
        spinner.succeed('Finished creating distribution directory');
    } catch (err) {
        spinner.fail('Failed creating distribution directory, maybe it already exists');
        return console.error(err);
    }
};

const copyToDist = async (directory, output, type) => {
    const spinner = ora(`Moving ${type} to ${output}`);
    try {
        await cloneDirectory(directory, output);
        spinner.succeed(`Finished moving ${type} to ${output}`);
    } catch (err) {
        spinner.fail(`Error moving ${type} to ${output}`);
        return console.error(err);
    }
};

const buildDistFiles = async () => {
    
    try {
        await buildDistDirectory();
        /* src/dev/images to dist/assets */
        await copyToDist(_Directorys.imagesRoot, _Directorys.distAssetsRoot, 'Images');
        /* src/dev/fonts to dist/assets */
        await copyToDist(_Directorys.fontsRoot, _Directorys.distAssetsRoot, 'Fonts');
        /* src/config to dist/config */
        await copyToDist(_Directorys.configRoot, _Directorys.distConfigRoot, 'Config');
        /* src/layout to dist/layout */
        await copyToDist(_Directorys.layoutRoot, _Directorys.distLayoutRoot, 'Layout');
        /* src/locales to dist/locales */
        await copyToDist(_Directorys.localesRoot, _Directorys.distLocalesRoot, 'Locales');
        /* src/sections to dist/sections */
        await copyToDist(_Directorys.sectionsRoot, _Directorys.distSectionsRoot, 'Sections');
        /* src/snippets to dist/snippets */
        await copyToDist(_Directorys.snippetsRoot, _Directorys.distSnippetsRoot, 'Snippets');
        /* src/templates to dist/templates */
        await copyToDist(_Directorys.templatesRoot, _Directorys.distTemplatesRoot, 'Templates');
        await sleep(500);
        const webPackSpinner = ora('Packing styles and scripts with Webpack').start();
        const command = spawn('npx', ['webpack', '--config', `${_Directorys.projectRoot}/webpack.production.config`]);
        command.stdout.on('data', data => {
            spawnCallback(data, false)
            if(data.toString().includes('ERROR')) {
                webPackSpinner.warn('There was an error in Webpack, maybe it still compiled - check the logging output above');
                process.exit(1);
            } else if (data.toString().includes('compiled successfully')) {
                webPackSpinner.succeed('Finished packing output files');
                process.exit(1);
            }
        });
        command.stderr.on('data', data => {
            spawnCallback(data, false)
            webPackSpinner.warn('There was an error in Webpack, maybe it still compiled - check the logging output above');
        });
        command.stdout.on('end', () => webPackSpinner.succeed('Finished packing styles and scripts'));
        command.on('error', err => {
            webPackSpinner.fail('Error packing styles and scripts');
            handleError(err.errno, err);
        });

    } catch (err) {
        spinner.fail('Error building distribution folder');
        return console.error(err);
    }
};

module.exports = {
    buildDistFiles,
}