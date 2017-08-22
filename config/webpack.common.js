var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');
var path = require('path');
const PATHS = {
  dist: path.join(__dirname, '/dist'),
  src: path.join(__dirname, './src'),
  style: path.join(__dirname, './src/assets/stylesheets')
};
//var TypedocWebpackPlugin = require('typedoc-webpack-plugin');
module.exports = {
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.ts'
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [{
        test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader',
          'angular2-template-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(woff|woff2|ttf|eot)([\?]?.*)$/,
        use: 'file-loader?name=./assets/fonts/[name].[ext]'
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)([\?]?.*)$/,
        use: 'file-loader?name=./assets/images/[name].[ext]'
      },
      {
        test: /\.(json)([\?]?.*)$/,
        use: 'file-loader?name=./assets/configs/[name].[ext]'
      },
      {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader'],
        exclude: [helpers.root('src', 'assets')]
      },
      /**
       * to string and sass loader support for *.scss files (from Angular components)
       * Returns compiled css content as string
       *
       */
      {
        test: /\.scss$/,
        use: [{loader: 'to-string-loader'}, { loader: 'style-loader'}, {loader: 'css-loader'}, {
          loader: 'postcss-loader',
          options: {
            plugins: function () { // post css plugins, can be exported to postcss.config.js
              return [
                require('precss'),
                require('autoprefixer')
              ];
            }
          }
        }, {
          loader: 'sass-loader'
        }],
        exclude: /node_modules/,
      }
    ]
  },

  plugins: [
    // Workaround for angular/angular#11580
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      helpers.root('./src'), // location of your src
      {} // a map of your routes
    ),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),
    //new TypedocWebpackPlugin({}),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery',
          Popper: ['popper.js', 'default'],
          // In case you imported plugins individually, you must also require them here:
          Util: "exports-loader?Util!bootstrap/js/dist/util",
          Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown"
    })
  ]
};