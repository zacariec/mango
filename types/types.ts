interface BuildOptions {
  environment: boolean | string,
  themeid: number | string,
}

interface Directory {
  from: string,
  to: string,
  name: string,
}

type Directories = Directory[]

interface ThemeOptions {
  dir: string[],
  file: string[],
  allowLive: boolean,
  verbose: boolean,
  name: string[],
  env: string,
  themeid: string,
  store: string,
  password: string,
}

interface Theme {
  id: number,
  name: string,
  role: string,
}

interface ThemeResponse extends Theme {
  theme: {
    id: number,
    name: string,
  }
  themes: [],
  asset: {
    value: string
  },
}

interface ServerAddressInfo {
  address: string,
  family:string,
  port: number,
}

interface StorefrontConfig {
  [key: string]: {
    store: string,
    password: string,
    theme_id: string,
  }
}

interface StoreEnvironment {
  store: string,
  password: string,
  theme_id: string,
  name: string,
}

export {
  BuildOptions,
  Directories,
  Theme,
  ThemeOptions,
  ThemeResponse,
  ServerAddressInfo,
  StorefrontConfig,
  StoreEnvironment,
};
