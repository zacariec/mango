import yaml from 'js-yaml';
import fs from 'fs-extra';
import { ThemeOptions } from '../../../types/types';

const configureYML = async ({ env, dir, password, themeid, file, store }: ThemeOptions): Promise<void> => {
  try {
    const environmentKey = env ? env : 'development';
    const config = {
      [environmentKey]: {
        directory: dir ? dir : `shop/dist`,
        password: password,
        theme_id: `${themeid}`,
        store: store,
        ignores: [file ? file : `.shopifyignores`]
      }
    }

    await fs.writeFile('config.yml', yaml.dump(config));
  } catch (err) {
    console.error(err);
  }
};

export default configureYML;
