const yaml = require('js-yaml');
const fs = require('fs-extra');

module.exports = configureYML = async (options) => {
  try {
    const environmentKey = options.env ? options.env : 'development';
    const config = {
      [environmentKey]: {
        directory: options.dir ? options.dir : `shop/dist`,
        password: options.password,
        theme_id: `${options.themeid}`,
        store: options.store,
        ignores: options.file ? options.file : `themekit_ignores`
      }
    }
  
    await fs.writeFile('config.yml', yaml.dump(config));
  } catch (err) {
    console.error(err);
  }
};
