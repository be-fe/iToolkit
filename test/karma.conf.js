module.exports = function(config) {

  var saucelabsBrowsers = require('./saucelabs-browsers').browsers,
    browsers = ['PhantomJS'];

  // run the tests only on the saucelabs browsers
  if (process.env.SAUCELABS) {
    browsers = Object.keys(saucelabsBrowsers)
  }

  config.set({
    basePath: '',
    autoWatch: true,
    frameworks: ['mocha'],
    plugins: [
        'karma-mocha',
        'karma-coverage',
        'karma-phantomjs-launcher',
        'karma-sauce-launcher',
        //'karma-requirejs'
    ],
    //proxies: {
    //    '/tag/': '/base/tag/'
    //},
    files: [
        'test-shim.js',
        '../node_modules/mocha/mocha.js',
        '../node_modules/expect.js/index.js',
        '../src/lib/riot.js',
        '../src/lib/common.js',
        '../src/lib/riot.js',
        '../src/itoolkit_pc.js',
         {
             pattern: 'specs/*.js',
             served: true,
             included: true
         }
    ],
    concurrency: 2,
    sauceLabs: {
        //build: 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')',
        //tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
        testName: 'iToolkit',
        startConnect: true,
        recordVideo: false,
        recordScreenshots: false
    },
    captureTimeout: 300000,
    browserNoActivityTimeout: 300000,
    browserDisconnectTolerance: 2,
    customLaunchers: saucelabsBrowsers,
    browsers: browsers,

    reporters: ['progress', 'saucelabs', 'coverage'],
    //preprocessors: {
    //    '../dist/riot/riot+compiler.js': ['coverage']
    //},

    coverageReporter: {
        dir: '../coverage/browsers',
        reporters: [{
            type: 'lcov',
            subdir: 'report-lcov'
        }]
    },

    singleRun: true
  })
}
