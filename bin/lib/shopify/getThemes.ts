import createClient from './client';
import { ThemeResponse } from "../../../types/types";

const getThemes = async (environment): Promise<ThemeResponse> => {
  const client = await createClient(environment);
  const request = await client.get({
    path: 'themes',
  });

  return await request.body as ThemeResponse;
};

export default getThemes;
