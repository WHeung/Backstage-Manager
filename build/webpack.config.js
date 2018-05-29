const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const WebpackShellPlugin = require('webpack-shell-plugin')
const timeStamp = ((new Date()).getTime() + '').substring(8)
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const alias = {
  // for img tag use
  'public': path.resolve(__dirname, '../src/public'),
  // for css use
  '~public': path.resolve(__dirname, '../src/public'),
  // for import use
  '~src': path.resolve(__dirname, '../src'),
  // for cloud img tag use
  'cdn': 'http://cdn01.dwfei.com/h5-admin/public',
  // for cloud css use
  '~cdn': 'http://cdn01.dwfei.com/h5-admin/public'
}

const config = {
  devtool: '#source-map',
  entry: {
    app: './src/app.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist/'),
    publicPath: './',
    filename: '[name].[chunkhash:8].js'
  },
  resolve: {
    alias: alias
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['env', 'stage-3']
        }
      },
      {
        test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(stylus|styl)$/,
        oneOf: [
          {
            resourceQuery: /module/,
            use: [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[local]_[hash:base64:5]',
                  alias: alias,
                  importLoaders: 2
                }
              },
              'postcss-loader',
              'stylus-loader'
            ]
          }, {
            use: [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2
                }
              },
              'postcss-loader',
              'stylus-loader'
            ]
          }
        ]
      },
      {
        test: /\.css$/,
        oneOf: [
          {
            resourceQuery: /module/,
            use: [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[local]_[hash:base64:5]',
                  alias: alias,
                  importLoaders: 1
                }
              },
              'postcss-loader'
            ]
          }, {
            use: [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1
                }
              },
              'postcss-loader'
            ]
          }
        ]
      }
    ]
  },
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new HTMLPlugin({
      template: 'src/index.html',
      title: timeStamp,
      env: process.env.NODE_ENV
    })
    // new ExtractTextPlugin('styles.[hash].css')
  ]
}

// development
if (process.env.NODE_ENV === 'development') {
  // 添加环境变量，比如安卓的webviewBridge
  config.mode = 'development'
  config.entry.app = ['./src/app.js']
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    })
  )
}
// analyzer
if (process.env.NODE_ENV === 'analyzer') {
  delete config.devtool
  config.output.path = path.resolve(__dirname, '../dist/')
  config.output.publicPath = './'

  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //     'drop_debugger': true,
    //     'drop_console': true
    //   }
    // }),
    new HTMLPlugin({
      template: 'src/index.html',
      filename: path.resolve(__dirname, '../dist/index.html'),
      env: process.env.NODE_ENV
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      // Host that will be used in `server` mode to start HTTP server.
      analyzerHost: '127.0.0.1',
      // Port that will be used in `server` mode to start HTTP server.
      analyzerPort: 8123,
      // Path to bundle report file that will be generated in `static` mode.
      // Relative to bundles output directory.
      reportFilename: 'report.html',
      // Module sizes to show in report by default.
      // Should be one of `stat`, `parsed` or `gzip`.
      // See "Definitions" section for more information.
      defaultSizes: 'parsed',
      // Automatically open report in default browser
      openAnalyzer: true,
      // If `true`, Webpack Stats JSON file will be generated in bundles output directory
      generateStatsFile: false,
      // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
      // Relative to bundles output directory.
      statsFilename: 'stats.json',
      // Options for `stats.toJson()` method.
      // For example you can exclude sources of your modules from stats file with `source: false` option.
      // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
      statsOptions: null,
      // Log level. Can be 'info', 'warn', 'error' or 'silent'.
      logLevel: 'info'
    })
  )
}

// test
if (process.env.NODE_ENV === 'test') {
  // delete config.devtool
  config.output.path = path.resolve(__dirname, '../static/')
  config.output.publicPath = './'

  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new HTMLPlugin({
      template: 'src/index.html',
      filename: path.resolve(__dirname, '../dist/index.html'),
      title: timeStamp
    })
  )
}

// production start
if (process.env.NODE_ENV === 'production') {
  delete config.devtool
  config.mode = 'production'
  config.output.path = path.resolve(__dirname, '../static/')
  config.output.publicPath = './'
  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new WebpackShellPlugin({
      onBuildStart: ['echo "Webpack Start PRO 😄 ' + timeStamp],
      onBuildEnd: [
        'echo "Webpack PRO End 😄 ' + timeStamp
      ]
    })
  )
}
// production end

module.exports = config
