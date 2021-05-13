const path = require('path');
const glob = require('fast-glob');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    theme: glob.sync(path.resolve('./shop/src/dev/js/*.js')),
    vendor: glob.sync(path.resolve('./shop/src/dev/js/vendor/*.js'))
  },
  mode: 'production',
  watch: false,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/, path.resolve('./shop/src/dev/js/vendor')],
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css%/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin({
      test: /\.js(\?.*)?$/i,
      exclude: path.resolve('./shop/src/dev/js/vendor'),
      parallel: true
    })],
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          type: 'css/mini-extract'
        }
      }
    }
  },
  output: {
    path: path.resolve('./shop/dist/assets'),
    filename: '[name].min.js'
  },
  plugins: [
    new ESLintPlugin({
      context: 'shop/src',
      files: ['**/*.js'],
      failOnError: false
    }),
    new MiniCssExtractPlugin({
      filename: '[name].min.css'
    }),
    new StyleLintPlugin({
      configFile: '.stylelintrc.json',
      context: 'shop/src',
      files: ['**/*.css', '**/*.scss'],
      failOnError: false
    })
  ],
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
  }
};
