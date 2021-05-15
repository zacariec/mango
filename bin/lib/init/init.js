const path = require('path');
const spawn = require('cross-spawn');
const ora = require('ora');
const { createDevDirectory } = require('../convert/convert');
const { cloneDirectory } = require('../utils/_fsUtils');
const _Directorys = require('../utils/_directorys');
const { spawnCallback, handleError } = require('../utils/_logUtils');


const installDependencies = (type) => {
    const spinner = ora('Installing peer dependencies').start();
    if(type.recommended === true || type === true) {
        const command = spawn('npm', [
            'install',
            '-D', 
            '@babel/core', 
            '@babel/preset-env', 
            'autoprefixer', 
            'babel-loader', 
            'core-js', 
            'css-loader', 
            'css-minimizer-webpack-plugin',
            'eslint',
            'eslint-config-airbnb-base',
            'eslint-webpack-plugin',
            'fast-glob',
            'mini-css-extract-plugin',
            'postcss-loader',
            'regenerator-runtime',
            'sass',
            'sass-loader',
            'style-loader',
            'stylelint',
            'stylelint-config-standard',
            'stylelint-webpack-plugin',
            'terser-webpack-plugin'
        ]);
        command.stdout.on('data', data => spawnCallback(data, false));
        command.stderr.on('data', data => {
            spawnCallback(data, false)
        });
        command.stdout.on('end', () => spinner.succeed('Installed standard dependencies successfully'));
        command.on('error', err => {
            spinner.fail('Error installing standard dependencies');
            handleError(err.errno, err)
        });
    } else {
        const command = spawn('npm', ['install', 'fast-glob']);
        command.stdout.on('data', data => spawnCallback(data, false));
        command.stderr.on('data', data => {
            spawnCallback(data, false)
        });
        command.stdout.on('end', () => spinner.succeed('Installed standard dependencies successfully'));
        command.on('error', err => {
            spinner.fail('Error installing standard dependencies');
            handleError(err.errno, err)
        });
    }
};

const initializeTheme = async (type = true) => {
    try {
        const settings = (type.recommended === true || type === true) ? _Directorys.recommendedSettings : _Directorys.standardSettings;
        await createDevDirectory();
        
        await cloneDirectory(path.resolve(settings), path.resolve('./'));
        installDependencies(type);

    } catch (err) {
        return console.error(err);
    }
};


module.exports = {
    initializeTheme,
};