import fs from 'fs-extra';
import { Ora } from 'ora';
import path from 'path';
import { SettingsSchema } from '../../../types/types';
import { auditDirectoryFiles, auditFile } from '../utils/_fsUtils';

type Settings = {
  id: string;
}

const auditSettingsSchema = async (spinner: Ora): Promise<string[]> => {
  const settingsPath: string = path.resolve('./shop/src/config/settings_schema.json');
  spinner.stopAndPersist({
    symbol: '🥭',
    text: `Reading settings_schema.json from ${settingsPath}`,
  });

  const settingsContent: Buffer = await fs.readFile(settingsPath);
  const settingsSchema: SettingsSchema[] = JSON.parse(settingsContent.toString());
  const files: string[] = [...await auditDirectoryFiles()];
  const existingSettings: Array<string[]> = [];
  const settings: Settings[] = settingsSchema.map((schema) => schema && schema.settings);
  const unusedSettings: string[] = [];
  const flattened: Settings[] = [...settings.flat()];
  const flattenedSettings: string[] = [...flattened.map((value: Settings) => value && value.id).filter(Boolean)];


  for await (const file of files) {
    spinner.stopAndPersist({
      symbol: '🥭',
      text: `Auditing ${file}`,
    });
    const setting = await auditFile(file, flattenedSettings);
    existingSettings.push(setting);
  }

  const settingsInUse: string[] = [...new Set(existingSettings.flat().filter(Boolean))];

  for await (const setting of flattenedSettings) {
    const settingString = `settings.${setting}`;

    if (!settingsInUse.includes(settingString)) {
      unusedSettings.push(settingString);
    }
  }

  spinner.stopAndPersist({
    symbol: unusedSettings.length >= 1 ? '⛔️' : '🥭',
    text: `There are ${unusedSettings.length} settings unused`,
  });

  return unusedSettings;
};

export default auditSettingsSchema;
