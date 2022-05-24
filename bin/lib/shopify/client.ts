import Shopify from '@shopify/shopify-api';
import { RestClient } from "@shopify/shopify-api/dist/clients/rest";
import { StoreEnvironment } from "../../../types/types";


const createClient = async (environment: StoreEnvironment): Promise<RestClient> => {
  try {
    return new Shopify.Clients.Rest(environment.store, environment.password);
  } catch (err) {
    console.error(err);
  }
};

export default createClient;
