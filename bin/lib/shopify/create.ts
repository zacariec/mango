import createClient from './client';
import createEnvironment from '../utils/_createEnvironment';
import { readThemeConfig } from '../utils/_readThemeConfig';
import { DataType } from '@shopify/shopify-api';
import { ThemeResponse } from "../../../types/types";

const createTheme = async (name, environment): Promise<ThemeResponse> => {
  const config = await readThemeConfig();
  const env = (environment) ? config[environment] : config[0];
  const client = await createClient(environment);
  const request = await client.post({
    path: 'themes',
    data: {
      "theme": {
        "name": `${name}`
      }
    },
    type: DataType.JSON
  });

  const response = await request.body as ThemeResponse;

  await createEnvironment(name, response.theme.id, env.store, env.password);

  return response;
};

export default createTheme;
