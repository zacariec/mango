const path = require('path');

module.exports = {
  mode: "production",
  entry: path.join(__dirname, "/shop/src/dev/js/theme.js"),
  watch: true,
  output: {
    path: path.join(__dirname, "/shop/dist/assets"),
    filename: 'theme.min.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
  }
};
