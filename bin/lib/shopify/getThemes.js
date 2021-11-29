const createClient = require('./client');

module.exports = getThemes = async () => {
  const client = await createClient();
  const request = await client.get({
    path: 'themes',
  });

  const response = await request.body;

  return response.themes;
};
