const getThemes = require('./getThemes');
const getPublishedTheme = (themes) => themes.find((theme) => theme.role === 'main' && theme);

module.exports = getPublished = async () => {
  const themes = await getThemes();
  const published = getPublishedTheme(themes);

  return published;
};
