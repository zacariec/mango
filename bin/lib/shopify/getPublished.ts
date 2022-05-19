import getThemes from './getThemes';
import { Theme } from "../../../types/types";

const getPublishedTheme = (themes: []): Theme => <Theme>themes.find((theme: Theme) => theme.role === 'main' && theme);

const getPublished = async (environment): Promise<Theme> => {
  const { themes } = await getThemes(environment);

  return getPublishedTheme(themes);
};

export default getPublished;
