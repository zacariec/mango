const yaml = require('js-yaml');
const fs = require('fs-extra');

module.exports = readThemeConfig = async () => {
  try {
    const config = await yaml.load(fs.readFileSync('mango.config.yml'));
    return config;
  } catch (err) {
    console.error(err);
  }
};
