// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack

var webpackConfig = require('../../build/webpack.test.conf')

module.exports = function (config) {
  config.set({
    // to run in additional browsers:
    // 1. install corresponding karma launcher
    //    http://karma-runner.github.io/0.13/config/browsers.html
    // 2. add it to the `browsers` array below.
    singleRun: true,
    browsers: ['ChromeHeadless'],
    frameworks: ['mocha', 'sinon-chai'],
    reporters: ['spec'],
    files: [
        //'https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js',
        '../../static/js/lodash.min.js',
        '../../static/js/cloudinary-core.min.js',
        '../../static/js/init-cloudinary.js',
        '../../static/js/axios.min.js',
        '../../static/js/bloodhound.min.js',
        '../../static/js/socket.io.js',
        '../../static/js/throttled-queue.min.js',
        '../../static/js/intro.js',
        '../../static/js/vue.runtime.min.js',
        '../../static/js/vue-router.min.js',
        '../../static/js/vuex.min.js',
        './index.js'
    ],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },/* 
    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    } */
  })
}
