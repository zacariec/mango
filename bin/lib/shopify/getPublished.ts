import getThemes from './getThemes';
import { Theme } from "../../../types/types";

const getPublishedTheme = (themes: []): Theme => <Theme>themes.find((theme: Theme) => theme.role === 'main' && theme);

const getPublished = async (): Promise<Theme> => {
  const { themes } = await getThemes();

  return getPublishedTheme(themes);
};

export default getPublished;
