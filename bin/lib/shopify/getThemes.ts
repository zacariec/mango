import createClient from './client';
import { ThemeResponse } from "../../../types/types";

const getThemes = async (): Promise<ThemeResponse> => {
  const client = await createClient();
  const request = await client.get({
    path: 'themes',
  });

  return await request.body as ThemeResponse;
};

export default getThemes;
