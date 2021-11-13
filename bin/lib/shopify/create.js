const createClient = require('./client');
const createEnvironment = require('../utils/_createEnvironment');
const readThemeConfig = require('../utils/_readThemeConfig');
const { DataType } = require('@shopify/shopify-api')

module.exports = createTheme = async (name) => {
  const config = await readThemeConfig();
  const client = await createClient();
  const request = await client.post({
    path: 'themes',
    data: {
      "theme": {
        "name": `${name}`
      }
    },
    type: DataType.JSON
  });

  const response = await request.body;

  createEnvironment(name, response.theme.id, config.store, config.password);

  return response;
};
