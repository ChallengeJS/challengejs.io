var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var isStaging = process.env.BUILD_ENVIRONMENT;
var isProduction = process.argv[2] == '-p' && process.env.NODE_ENV == 'production' && !isStaging;


var config = {
  devtool: 'eval',
  entry: {
    application: './static_src/index.js',
    embed: './static_src/embed/embed.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, 'static')
  },
  module: {
    preLoaders: [
      //{test: /\.js$/, loader: 'eslint-loader', exclude: /(node_modules|test\/)/}
    ],
    loaders: [
      {test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/ // keep node modules out of here or it gets really slow.
      },

      {test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')},
      //{test: /\.html$/, loader: 'ngtemplate?relativeTo=' + path.resolve(__dirname, './static/app') +'!html-loader', exclude: /\/node_modules\//},
      {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' } // inline base64 URLs for <=8k images, direct URLs for the rest
    ]

  },

  externals: {
    'jquery': 'jQuery'
  },

  plugins: [
    //new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new ExtractTextPlugin('styles.css', {allChunks: true})
  ]
};

if (isStaging || isProduction) {
  config.devtool = undefined;
  config.module.preLoaders = undefined;
}

if (isProduction) {
  console.log('production mode enabled, running uglify');
  config.plugins= [new webpack.optimize.UglifyJsPlugin({
    mangle: true,
    compress: true,
    verbose: true
  })].concat(config.plugins);
}




module.exports = config;
