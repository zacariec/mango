import createClient from './client';
import { StoreEnvironment, ThemeResponse } from "../../../types/types";

/**
 * Takes in a environment string, which looks for the environment in the config.yml
 * Returns the request body as ThemeResponse, or a boolean as false if errored.
 * @param environment - String
 * @param asset - String
 * @returns ThemeResponse
 */
const getAsset = async (environment: StoreEnvironment, id, asset: string): Promise<ThemeResponse> => {
  const client = await createClient(environment);
  const request = await client.get({
    path: `themes/${id}/assets`,
    query: {"asset[key]":asset},
  });

  return await request.body as ThemeResponse;
};

export default getAsset;
