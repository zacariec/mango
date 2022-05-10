interface BuildOptions {
  updateConfig: boolean,
}

interface ThemeOptions {
  dir: string[],
  file: string[],
  allowLive: boolean,
  verbose: boolean,
  name: string[],
  env: string
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

interface StorefrontConfig {
  [key: string]: {
    store: string,
    password: string,
  }
}

export {
  BuildOptions,
  Theme,
  ThemeOptions,
  ThemeResponse,
  StorefrontConfig,
};
