import fs from 'fs-extra';

type File = {
  name: string;
  content: string;
};

type Files = File[];

const filesToCreate: Files = [
  {
    name: '.browserslistrc',
    content: 'last 2 version'
  },
  {
    name: '.eslintignore',
    content: `shop/dist/assets/*.js
              **/*.spec.js
              .eslintrc.js
              .stylelintrc.json
              babel.config.json
              config.yml
              package-lock.json
              package.json
              postcss.config.js
              webpack.config.js
              shop/src/dev/static`,
  },
  {
    name: '.eslintrc.json',
    content: `{
                "env": {
                  "browser": true,
                  "es6": true
                },
                "extends": "airbnb-base",
                "parser": "babel-eslint",
                "parserOptions": {
                  "sourceType": "module",
                  "ecmaVersion": 6
                },
                "rules": {
                  "max-classes-per-file": 0,
                  "class-methods-use-this": 0,
                  "no-underscore-dangle": 0
                }
              }`
  },
  {
    name: '.shopifyignores',
    content: `templates/*.json
              locales/*.json
              config/settings_data.json`
  },
  {
    name: '.stylelintrc.json',
    content: `{
                "extends": "stylelint-config-standard"
              }`
  },
  {
    name: 'babel.config.json',
    content: `{
                "presets": [
                  ["@babel/preset-env", {
                    "useBuiltIns": "usage",
                    "debug": true,
                    "corejs": { "version": "3.11" }
                  }]
                ],
                "ignore": [ "node_modules" ]
              }`
  },
  {
    name: 'config.yml',
    content: `development:
              password: example_password
              theme_id: "1234567890123"
              store: example.myshopify.com
              directory: shop/dist
              ignore_files:
              - config/settings_data.json
            `
  },
  {
    name: 'package.json',
    content: `{
                "name": "mango-project",
                "version": "1.0.0",
                "description": "A project initialized by @shopackify/mango",
                "devDependencies": {
                  "@babel/eslint-plugin": "^7.17.7",
                  "@babel/core": "^7.14.2",
                  "@babel/eslint-parser": "^7.17.0",
                  "@babel/preset-env": "^7.14.2",
                  "autoprefixer": "^10.2.5",
                  "babel-loader": "^8.2.2",
                  "core-js": "^3.12.1",
                  "css-loader": "^5.2.4",
                  "css-minimizer-webpack-plugin": "^3.0.0",
                  "eslint": "^7.26.0",
                  "eslint-config-airbnb-base": "^14.2.1",
                  "eslint-plugin-import": "^2.25.3",
                  "eslint-webpack-plugin": "^2.5.4",
                  "extract-css-chunks-webpack-plugin": "^4.9.0",
                  "postcss": "^8.3.5",
                  "postcss-custom-media": "^8.0.0",
                  "postcss-import": "^14.0.2",
                  "postcss-loader": "^5.3.0",
                  "postcss-preset-env": "^6.7.0",
                  "precss": "^4.0.0",
                  "regenerator-runtime": "^0.13.7",
                  "style-loader": "^2.0.0",
                  "stylelint": "^13.13.1",
                  "stylelint-config-standard": "^22.0.0",
                  "stylelint-webpack-plugin": "^2.1.1",
                  "terser-webpack-plugin": "^5.1.2",
                  "webpack": "5.44.0",
                  "webpack-cli": "^4.7.2",
                  "webpack-remove-empty-scripts": "^0.7.1",
                  "webpack-watched-glob-entries-plugin": "^2.1.9"
                },
                "author": "@Shopackify",
                "license": "ISC"
              }`
  },
  {
    name: 'postcss.config.js',
    content: `module.exports = {
                plugins: {
                  'postcss-import': {},
                  'postcss-custom-media': {},
                  precss: {},
                  autoprefixer: {},
                }
              };
              `
  },
  {
    name: 'webpack.config.js',
    content: `const path = require('path');
              const WebpackWatchedGlobEntries = require('webpack-watched-glob-entries-plugin');
              const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
              const ESLintPlugin = require('eslint-webpack-plugin');
              const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
              const StyleLintPlugin = require('stylelint-webpack-plugin');
              const TerserPlugin = require('terser-webpack-plugin');
              const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
              
              module.exports = {
                entry: WebpackWatchedGlobEntries.getEntries([
                  path.resolve('./shop/src/dev/js/*.js'),
                  path.resolve('./shop/src/dev/styles/typography/*.css'),
                  path.resolve('./shop/src/dev/styles/base/*.css'),
                  path.resolve('./shop/src/dev/styles/components/*.css'),
                  path.resolve('./shop/src/dev/styles/sections/*.css'),
                  path.resolve('./shop/src/dev/styles/templates/*.css')
                ]),
                mode: 'development',
                optimization: {
                  usedExports: true,
                },
                watch: true,
                module: {
                  rules: [
                    {
                      test: /\\.js$/,
                      exclude: [
                        /node_modules/,
                        path.resolve('./shop/src/dev/static'),
                      ],
                      use: ['babel-loader']
                    },
                    {
                      include: [
                        path.resolve('./shop/src/dev/styles/base'),
                        path.resolve('./shop/src/dev/styles/components'),
                        path.resolve('./shop/src/dev/styles/mixins'),
                        path.resolve('./shop/src/dev/styles/sections'),
                        path.resolve('./shop/src/dev/styles/templates'),
                        path.resolve('./shop/src/dev/styles/typography'),
                        path.resolve('./shop/src/dev/styles/variables'),
                      ],
                      exclude: path.resolve('./shop/src/dev/styles/raw'),
                      use: [
                        {
                          loader: ExtractCssChunks.loader,
                          options: {
                            publicPath: path.resolve('./shop/dist/assets/'),
                          },
                        },
                        {
                          loader: 'css-loader',
                          options: {
                            importLoaders: 1,
                          },
                        },
                        {
                          loader: 'postcss-loader',
                          options: {
                            postcssOptions: {
                              config: path.resolve(__dirname, 'postcss.config.js')
                            },
                          },
                        },
                      ],
                    }
                  ]
                },
                optimization: {
                  minimize: true,
                  minimizer: [new CssMinimizerPlugin(), new TerserPlugin({
                    test: /\\.js(\\?.*)?$/i,
                    parallel: true,
                    extractComments: false,
                  })],
                  splitChunks: {
                    cacheGroups: {
                      styles: {
                        name: 'styles',
                        type: 'css/mini-extract',
                        test: /\\.css$/,
                        chunks: 'all',
                        enforce: true,
                      },
                    },
                  },
                },
                output: {
                  path: path.resolve('./shop/dist/assets'),
                  filename: '[name].min.js',
                },
                plugins: [
                  new ESLintPlugin({
                    context: 'shop/src',
                    files: ['**/*.js'],
                    failOnError: false,
                  }),
                  new WebpackWatchedGlobEntries(),
                  new ExtractCssChunks({
                    filename: '[name].min.css',
                  }),
                  new RemoveEmptyScriptsPlugin(),
                ],
                resolve: {
                  modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
                }
              };
              `
  },
  {
    name: 'webpack.production.config.js',
    content: `const path = require('path');
              const WebpackWatchedGlobEntries = require('webpack-watched-glob-entries-plugin');
              const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
              const ESLintPlugin = require('eslint-webpack-plugin');
              const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
              const StyleLintPlugin = require('stylelint-webpack-plugin');
              const TerserPlugin = require('terser-webpack-plugin');
              const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
              
              module.exports = {
                entry: WebpackWatchedGlobEntries.getEntries([
                  path.resolve('./shop/src/dev/js/*.js'),
                  path.resolve('./shop/src/dev/styles/typography/*.css'),
                  path.resolve('./shop/src/dev/styles/base/*.css'),
                  path.resolve('./shop/src/dev/styles/components/*.css'),
                  path.resolve('./shop/src/dev/styles/sections/*.css'),
                  path.resolve('./shop/src/dev/styles/templates/*.css')
                ]),
                mode: 'production',
                optimization: {
                  usedExports: true,
                },
                watch: false,
                module: {
                  rules: [
                    {
                      test: /\\.js$/,
                      exclude: [
                        /node_modules/,
                        path.resolve('./shop/src/dev/static'),
                      ],
                      use: ['babel-loader']
                    },
                    {
                      include: [
                        path.resolve('./shop/src/dev/styles/base'),
                        path.resolve('./shop/src/dev/styles/components'),
                        path.resolve('./shop/src/dev/styles/mixins'),
                        path.resolve('./shop/src/dev/styles/sections'),
                        path.resolve('./shop/src/dev/styles/templates'),
                        path.resolve('./shop/src/dev/styles/typography'),
                        path.resolve('./shop/src/dev/styles/variables'),
                      ],
                      exclude: path.resolve('./shop/src/dev/styles/raw'),
                      use: [
                        {
                          loader: ExtractCssChunks.loader,
                          options: {
                            publicPath: path.resolve('./shop/dist/assets/'),
                          },
                        },
                        {
                          loader: 'css-loader',
                          options: {
                            importLoaders: 1,
                          },
                        },
                        {
                          loader: 'postcss-loader',
                          options: {
                            postcssOptions: {
                              config: path.resolve(__dirname, 'postcss.config.js')
                            },
                          },
                        },
                      ],
                    }
                  ]
                },
                optimization: {
                  minimize: true,
                  minimizer: [new CssMinimizerPlugin(), new TerserPlugin({
                    test: /\\.js(\\?.*)?$/i,
                    parallel: true,
                    extractComments: false,
                  })],
                  splitChunks: {
                    cacheGroups: {
                      styles: {
                        name: 'styles',
                        type: 'css/mini-extract',
                        test: /\\.css$/,
                        chunks: 'all',
                        enforce: true,
                      },
                    },
                  },
                },
                output: {
                  path: path.resolve('./shop/dist/assets'),
                  filename: '[name].min.js',
                },
                plugins: [
                  new ESLintPlugin({
                    context: 'shop/src',
                    files: ['**/*.js'],
                    failOnError: false,
                  }),
                  new WebpackWatchedGlobEntries(),
                  new ExtractCssChunks({
                    filename: '[name].min.css',
                  }),
                  new RemoveEmptyScriptsPlugin(),
                ],
                resolve: {
                  modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
                }
              };
              `
  }
]

const createProjectFiles = async (): Promise<void> => {
  for await (const file of filesToCreate) {
    await fs.writeFileSync(file.name, file.content);
  }
};

export default createProjectFiles;
