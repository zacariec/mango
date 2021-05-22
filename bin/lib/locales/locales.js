const ora = require('ora');
const { emptyLeaves } = require('./empty-leaves');
const { defaultsDeep, cloneDeep } = require('lodash');
const fs = require('fs-extra');
const { devRoot, localesRoot } = require('../utils/_directorys');

const localesConfigJsonFile = 'locales.config.json';
const ORA_NAMESPACE = 'Locale Compilation';

const bufferToJson = buffer => {
  try {
    return JSON.parse(buffer.toString());
  } catch (e) {
    return {};
  }
}

const writeLocale = (locale, content) => fs.writeJSON(`${localesRoot}/${locale}.json`, content, { spaces: 2 });

const compileLocale = async (locale, existingFiles, translations, blanks) => {
  const spinner = ora(`${ORA_NAMESPACE} - Compiling ${locale}`).start();
  // check if exists
  const targetLocale = existingFiles.find(file => file === `${locale}.json`);
    
  let existingJson = {};
  if (targetLocale) {
    spinner.text = `Found existing file for ${locale}, merging it's contents as default.`;
    const targetFileBuffer = await fs.readFile(`${localesRoot}/${targetLocale}`);
    existingJson = bufferToJson(targetFileBuffer);
  }
  
  try {
    const isDefault = locale.includes('default');
    const combined = defaultsDeep({}, existingJson, (isDefault ? translations : blanks));
    spinner.text = `Writing ${locale}`;
    await writeLocale(locale, combined);
    spinner.succeed(`${locale} done`);
  } catch (e) {
    spinner.fail(`${ORA_NAMESPACE} - Error compiling for ${locale}`);
    return console.error(e);
  }
}

const compileLocales = async () => {
  const spinner = ora().start(`${ORA_NAMESPACE} - Start`);
  try {
    const existingFiles = await fs.readdir(localesRoot);
    const localesConfigJsonBuffer = await fs.readFile(`${devRoot}/${localesConfigJsonFile}`);

    const { locales, translations } = bufferToJson(localesConfigJsonBuffer);
    const blankTranslations = emptyLeaves(cloneDeep(translations));
    await Promise.all(locales.map(locale => compileLocale(locale, existingFiles, translations, blankTranslations)));

    spinner.succeed(`${ORA_NAMESPACE} - Complete`);
  } catch (e) {
    spinner.fail(`${ORA_NAMESPACE} - Error`);
    return console.error(e);
  }
}

module.exports = {
  compileLocales
}