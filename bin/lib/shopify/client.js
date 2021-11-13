const Shopify = require('@shopify/shopify-api').Shopify;
const readThemeConfig = require('../utils/_readThemeConfig');

module.exports = createClient = async () => {
  try {
    const config = await readThemeConfig();
    return new Shopify.Clients.Rest(config.store, config.password);
  } catch (err) {
    console.error(err);
  }
};
