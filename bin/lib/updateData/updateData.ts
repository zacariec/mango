import path from 'path';
import fs from 'fs-extra';
import ora from 'ora';
import getPublished from '../shopify/getPublished';
import getAsset from '../shopify/getAsset';

const updateData = async (options): Promise<void> => {
  const settings = (typeof options !== 'undefined' && Object.keys(options).length !== 0) ? options : null;
  const spinner = ora('Updating config/settings_data.json').start();

  try {
    spinner.text = `Finding the Published Theme`;
    const published = await getPublished();

    const id = (settings !== null)
      ? (Object.values(settings)[0] === true)
        ? published.id
        : Object.values(settings)[0]
      : published.id;

    spinner.text = `Getting config settings from Theme: ${id}`;

    const { asset } = await getAsset(id, 'config/settings_data.json');
    const { value: data } = asset;

    fs.writeFileSync(path.resolve('./shop/src/config/settings_data.json'), data.toString(), { encoding: 'utf8' });
    spinner.succeed(`Successfully updated config/settings_data.json from Theme: ${id}`);
  } catch (err) {
    spinner.fail('Error updating config/settings_data.json');
    console.error(err);
  }
};

export default updateData;
