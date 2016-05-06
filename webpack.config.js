const path = require('path');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

const merge = require('webpack-merge');

const TARGET = process.env.npm_lifecycle_event;

const webpack = require('webpack');

const NpmInstallPlugin = require('npm-install-webpack-plugin');

process.env.BABEL_ENV = TARGET;

const common = {

  entry: {
    app: PATHS.app
  },

  resolve: {
    extensions: ['','.js','.jsx']
  },

  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },

module: {
  loaders: [
    {
      test: /\.css$/,
      loaders: ['style', 'css'],
      include: PATHS.app

    },
    {
      test: /\.jsx?$/,
      loaders: ['babel?cacheDirectory'],
      include: PATHS.app
    }
    ]
  }

};

if(TARGET === 'build' || !TARGET) {
  module.exports = merge(common, {});
}
if(TARGET === 'start' || !TARGET) {

  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      contentBase: PATHS.build,

      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      stats: 'errors only',
      host: process.env.HOST,
      port: process.env.PORT
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true // --save
      })
      ]
  });
}
