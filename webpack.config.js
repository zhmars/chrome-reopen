const path = require('path')

const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const { version } = require('./package.json')

const config = {
  mode: process.env.NODE_ENV || 'development',
  context: path.resolve(__dirname, 'src'),
  entry: {
    background: './background.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      { from: 'icons', to: 'icons' },
      { from: '_locales', to: '_locales' },
      {
        from: 'manifest.json',
        to: 'manifest.json',
        transform: (content) => {
          const jsonContent = JSON.parse(content)
          jsonContent.version = version
          if (config.mode === 'development') {
            jsonContent.content_security_policy = "script-src 'self' 'unsafe-eval'; object-src 'self'"
          }
          return JSON.stringify(jsonContent, null, 2)
        }
      }
    ])
  ]
}

if (config.mode === 'production') {
  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ])
}

module.exports = config
