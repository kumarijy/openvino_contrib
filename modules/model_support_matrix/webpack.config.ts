import path from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: webpack.Configuration = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'OpenVINO Model Support Matrix',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/data',
          to: 'data',
        },
      ],
    }),
  ],
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'public'),
      },
      {
        directory: path.join(__dirname, 'src/data'),
        publicPath: '/data',
      },
    ],
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
};

export default config;
