import ora from 'ora';
import emptyLeaves from './empty-leaves';
import defaultsDeep from 'lodash/defaultsDeep';
import cloneDeep from 'lodash/cloneDeep';
import fs from 'fs-extra';
import _Directories from '../utils/_directorys';

const localesConfigJsonFile = 'locales.config.json';
const ORA_NAMESPACE = 'Locale Compilation';

const bufferToJson = buffer => {
  try {
    return JSON.parse(buffer.toString());
  } catch (e) {
    return {};
  }
}

const writeLocale = (locale, content) => fs.writeJSON(`${_Directories.localesRoot}/${locale}.json`, content, { spaces: 2 });

const compileLocale = async (locale, existingFiles, translations, blanks) => {
  const spinner = ora(`${ORA_NAMESPACE} - Compiling ${locale}`).start();
  // check if exists
  const targetLocale = existingFiles.find(file => file === `${locale}.json`);

  let existingJson = {};
  if (targetLocale) {
    spinner.text = `Found existing file for ${locale}, merging it's contents as default.`;
    const targetFileBuffer = await fs.readFile(`${_Directories.localesRoot}/${targetLocale}`);
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
    const existingFiles = await fs.readdir(_Directories.localesRoot);
    const localesConfigJsonBuffer = await fs.readFile(`${_Directories.devRoot}/${localesConfigJsonFile}`);

    const { locales, translations } = bufferToJson(localesConfigJsonBuffer);
    const blankTranslations = emptyLeaves(cloneDeep(translations));
    await Promise.all(locales.map(locale => compileLocale(locale, existingFiles, translations, blankTranslations)));

    spinner.succeed(`${ORA_NAMESPACE} - Complete`);
  } catch (e) {
    spinner.fail(`${ORA_NAMESPACE} - Error`);
    return console.error(e);
  }
}

export default compileLocales;
