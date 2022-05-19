import yaml from 'js-yaml';
import fs from 'fs-extra';
import { StorefrontConfig, StoreEnvironment } from "../../../types/types";

const readThemeConfig = async (): Promise<StorefrontConfig> => {
  try {
    return {
      ...await yaml.load(fs.readFileSync('config.yml')),
    };
  } catch (err) {
    console.error(err);
  }
};

const getConfigFromEnvironment = async (environment): Promise<StoreEnvironment> => {
  const config = { ...await yaml.load(fs.readFileSync('config.yml')) };
  let configToReturn = {
    ...config[environment],
    name: environment,
  };

  if (!config[environment]) {
    console.error(`couldn't find the provided environment, falling back to development`);
    configToReturn = {
      ...config[Object.keys(config)[0]],
      name: 'development',
    };
  }

  return configToReturn;
};

export {
  readThemeConfig,
  getConfigFromEnvironment,
};
