// Karma configuration
// Generated on Tue Jun 09 2015 11:47:22 GMT-0400 (Eastern Daylight Time)
'use strict';
/* jshint camelcase: false */

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter 
	//
	// "requirejs" must come before "chai" or Chai will not load properly.
	// Sidenote: Karma loads the listed frameworks backwards.
    frameworks: ['mocha', 'requirejs', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      'rjsconfig.js',
      'test/karma_config/test-main.js',
      //'test/_stub_stringCalculator.js',
      {pattern: 'src/**/*.js', included: false},
      {pattern: 'test/**/*.js', included: false},
      {pattern: 'bower_components/**/*.js', included: false},
      {pattern: '*.js', included: false},
      {pattern: '**/*.html', included: false},
      {pattern: '**/*.less', included: false}
    ],

    // list of files to exclude
	exclude: [
      'src/main.js',
      'bower_components/history/vendor/**/*.js',
      'bower_components/mocha/**/*.js',
      'bower_components/knockout.mapping/build/output/knockout.mapping-latest.js',
      'test/**/_stub*.js',
      '**/*.spec.js'
	],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9004,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['Chrome', 'IE', 'Firefox'],
    browsers: ['PhantomJS_without_security'],

    // you can define custom flags
    customLaunchers: {
      PhantomJS_without_security: {
        base: 'PhantomJS',
        flags: ['--web-security=no']
      }
    },

	// If browser does not capture in given timeout [ms], kill it
	captureTimeout: 60000,
    browserNoActivityTimeout: 30000,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
