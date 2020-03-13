const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './js/app.js',
  output: {
    path: __dirname + '/docs',
    filename: 'bundle.min.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new CopyWebpackPlugin([
      { from: '*.html' },
      { from: '*.png' },
      { from: '*.jpg' },
    ])
  ],
  module: {
    rules: [
      {
        test: /\.(s)*css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader'}
        ]
      }, {
        test: /\.(ttf|jpg|png)$/,
        use: 'url-loader'
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'] }
        }
      }
    ],
  }
};
