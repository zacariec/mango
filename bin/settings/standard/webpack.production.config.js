const path = require('path');
const glob = require('fast-glob');

module.exports = {
  entry: {
    theme: glob.sync(path.resolve('./shop/src/dev/js/*.js')),
    vendor: glob.sync(path.resolve('./shop/src/dev/js/vendor/*.js'))
  },
  mode: 'production',
  watch: true,
  output: {
    path: path.resolve('./shop/dist/assets'),
    filename: '[name].min.js'
  },
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
  }
};
