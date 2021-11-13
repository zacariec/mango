const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

module.exports = createEnvironment = async (name, themeid, store, password) => {
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
