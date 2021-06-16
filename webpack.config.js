const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const miniCss = require('mini-css-extract-plugin');


module.exports = {
    entry: {
        main: path.resolve(__dirname, './src/index.js'),
    },
    output: {
      path: path.resolve(__dirname, './docs'),
      filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
        title: 'webpack Boilerplate',
        template: path.resolve(__dirname, './src/template.html'), // шаблон
        filename: 'index.html', // название выходного файла
    }),
    new miniCss({
      filename: 'style.css',
   }),
],

devServer: {
  publicPath: "/",
  contentBase: "./docs",
  port: 8000,
  historyApiFallback: true,
  hot: true,
},
module: {
  rules: [{
     test:/\.(s*)css$/,
     use: [
        miniCss.loader,
        'css-loader',
        'sass-loader',
     ]
  }]
},

}