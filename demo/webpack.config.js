/* eslint-env node */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'src/index.tsx'),
  output: {
    filename: `bundle.js`,
    path: path.join(__dirname, 'dist'),
  },
  node: false,
  resolve: { extensions: ['.js', '.ts', '.tsx'] },
  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/,
        use: {
          loader: 'esbuild-loader',
          options: {
            target: 'es2015',
          },
        },
      },
    ],
  },
  devtool: 'source-map',
  devServer: {
    port: 9000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
    }),
  ],
};
