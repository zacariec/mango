import yaml from 'js-yaml';
import fs from 'fs-extra';
import { StorefrontConfig } from "../../../types/types";

const readThemeConfig = async (): Promise<StorefrontConfig> => {
  try {
    return {
      ...await yaml.load(fs.readFileSync('config.yml')),
    };
  } catch (err) {
    console.error(err);
  }
};

export default readThemeConfig;
