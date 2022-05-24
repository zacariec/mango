import path from 'path';
import fs from 'fs-extra';
import ora, { Ora } from 'ora';
import getAsset from '../shopify/getAsset';
import {BuildOptions, StoreEnvironment} from '../../../types/types';
import {getConfigFromEnvironment} from "../utils/_readThemeConfig";

/**
 * Updates the settings_data.json config from the specified environment, if none specified
 * Then it will update from the first selected environment in config.yml usually (development).
 * @param environment - String | Boolean
 */
const updateData = async ({ environment, themeid }: BuildOptions): Promise<void> => {
  const spinner: Ora = ora('Updating config/settings_data.json').start();

  if (!environment) {
    spinner.fail('No flags provided for --env or --themeid, please provide an --env to get data from.');
    return;
  }

  try {
    spinner.text = `Finding the Published Theme`;
    const env: StoreEnvironment = await getConfigFromEnvironment(environment);
    const id = (themeid) ? themeid : env.theme_id;

    spinner.text = `Getting config settings from Theme: ${id}`;

    const { asset } = await getAsset(env, id, 'config/settings_data.json');
    const { value: data } = asset;

    // Update the settings_data.json file in our shop/src/config folder from the returned result.
    fs.writeFileSync(path.resolve('./shop/src/config/settings_data.json'), data.toString(), { encoding: 'utf8' });
    spinner.succeed(`Successfully updated config/settings_data.json from Theme: ${env.theme_id}`);
    return;
  } catch (err) {
    spinner.fail('Error updating config/settings_data.json');
    console.error(err);
    return;
  }
};

export default updateData;
