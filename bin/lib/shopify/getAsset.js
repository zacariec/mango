const createClient = require('./client');

module.exports = getAsset = async (theme, asset) => {
  try {
    const client = await createClient();
    const request = await client.get({
      path: `themes/${theme}/assets`,
      query: {"asset[key]":asset},
    });
    
    const response = await request.body.asset;
    return response;
  } catch (err) {
    console.error(err);
  }
};
