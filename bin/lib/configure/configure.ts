import yaml from 'js-yaml';
import fs from 'fs-extra';

const configureYML = async (options) => {
  try {
    const environmentKey = options.env ? options.env : 'development';
    const config = {
      [environmentKey]: {
        directory: options.dir ? options.dir : `shop/dist`,
        password: options.password,
        theme_id: `${options.themeid}`,
        store: options.store,
        ignores: [options.file ? options.file : `.shopifyignores`]
      },
      'mango_private_app': {
        store: options.store,
        password: options.password
      }
    }

    await fs.writeFile('config.yml', yaml.dump(config));
  } catch (err) {
    console.error(err);
  }
};

export default configureYML;
