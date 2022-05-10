import Shopify from '@shopify/shopify-api';
import { RestClient } from "@shopify/shopify-api/dist/clients/rest";
import readThemeConfig from '../utils/_readThemeConfig';


const createClient = async (): Promise<RestClient> => {
  try {
    const config = await readThemeConfig();
    return new Shopify.Clients.Rest(config.mango_private_app.store, config.mango_private_app.password);
  } catch (err) {
    console.error(err);
  }
};

export default createClient;
