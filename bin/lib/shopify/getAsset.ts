import createClient from './client';
import {ThemeResponse} from "../../../types/types";

const getAsset = async (theme, asset): Promise<ThemeResponse> => {
  try {
    const client = await createClient();
    const request = await client.get({
      path: `themes/${theme}/assets`,
      query: {"asset[key]":asset},
    });

    return await request.body as ThemeResponse;
  } catch (err) {
    console.error(err);
  }
};

export default getAsset;
