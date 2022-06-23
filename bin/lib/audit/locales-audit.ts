import fs from 'fs-extra';
import { auditDirectoryFiles } from '../utils/_fsUtils';
import _Directories from '../utils/_directorys';
import { Ora } from 'ora';

const localeKeys: string[] = [];

const traverseObjectTree = async (obj: object, pointer: string | number): Promise<void>  => {
  for await (const key of Object.keys(obj)) {
    const value: string = obj[key];

    if (typeof value === 'object') {
      await traverseObjectTree(value, key);
    }

    if (typeof value === 'string') {
      localeKeys.push(`${pointer}.${key}`);
    }
  }
}

const auditLocales = async (spinner: Ora): Promise<string[]> => {
  const { localesRoot }: { localesRoot: string } = _Directories;
  spinner.stopAndPersist({
    symbol: '🤟',
    text: `Reading default locales from ${localesRoot}`,
  });
  const locales: string[] = await fs.readdir(localesRoot);
  const files: string[] = [...await auditDirectoryFiles()];

  for await (const locale of locales) {
    if (locale.includes('.default')) {
      spinner.stopAndPersist({
        symbol: '🤟',
        text: `Auditing ${locale}`,
      });
      const localeContent: Buffer = await fs.readFile(`${localesRoot}/${locale}`);
      const localeSchema: object = JSON.parse(localeContent.toString());

      await traverseObjectTree(localeSchema, 0);
    }
  }

  const keys: string[] = [...localeKeys];
  const keysInUse: string[] = [];

  for await (const file of files) {
    if (file.includes('.liquid')) {
      const fileBuffer: Buffer = await fs.readFile(file);
      const fileContent = fileBuffer.toString();
  
      for await (const key of keys) {
        if (fileContent.includes(key)) {
          keysInUse.push(key);
        }
      }
    }
  }

  return keys.map((key) => ![... new Set(keysInUse)].includes(key) && key).filter(Boolean);
};

export default auditLocales;