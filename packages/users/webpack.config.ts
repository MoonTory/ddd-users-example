import path from 'path';
import { Configuration } from 'webpack';
import NodeExternals from 'webpack-node-externals';
import WebpackShellPlugin from 'webpack-shell-plugin-next';
import TSConfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const { NODE_ENV = 'production' } = process.env;

module.exports = {
  entry: './src/bin/index.ts',
  mode: NODE_ENV,
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [
      new TSConfigPathsPlugin({
        configFile: path.resolve(__dirname, 'tsconfig.json')
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        exclude: /node_modules/
      }
    ]
  },
  watch: NODE_ENV === 'development',
  externals: [NodeExternals()],
  plugins: [
    new WebpackShellPlugin({
      onBuildEnd: 'yarn run:dev'
    })
  ]
} as Configuration;
