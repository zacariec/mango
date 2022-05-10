import path from 'path';
import fs from 'fs-extra';
import yaml from 'js-yaml';

const createEnvironment = async (name, themeid, store, password): Promise<void> => {
  try {
    const config = await yaml.load(fs.readFileSync('config.yml'));
    const newEnvironment = {
      ...config,
      [name]: {
        password,
        theme_id: `${themeid}`,
        store
      }
    };

    await fs.writeFile(path.resolve('config.yml'), yaml.dump(newEnvironment));
  } catch (err) {
    return console.error(err);
  }
};

export default createEnvironment;
