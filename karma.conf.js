const webpackConfig = require('./webpack.config');

module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: [
      // all files ending in "_test"
      { pattern: 'test/*.spec.js', watched: false },
      { pattern: 'test/**/*.spec.js', watched: false }
      // each file acts as entry point for the webpack configuration
    ],
    preprocessors: {
      // add webpack as preprocessor
      'test/*.spec.js': ['webpack'],
      'test/**/*.spec.js': ['webpack']
    },
    reporters: ['progress'],
    browsers: ['ChromeHeadless'],
    webpack: webpackConfig,
    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      stats: 'errors-only'
    }
  })
}
