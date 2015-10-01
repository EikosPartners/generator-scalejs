'use strict';
Function.prototype.bind = Function.prototype.bind || function (thisp) {
    var fn = this;
    return function () {
        return fn.apply(thisp, arguments);
    };
};

var allTestFiles = [];
//test scripts should be placed into files with *test.js or *spec.js suffix
var TEST_REGEXP = /(spec|test)\.js$/i;

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(file);
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base/src',
  config: {
      'scalejs.mvvm': {
          doNotRender: true
      }
  },
  paths: {
    // This hook is needed for the generator to add modules
    /*========Yeoman Hook=======*/
    'scalejs.sandbox': '../bower_components/scalejs/dist/scalejs',
	  'test' : '../test'    
  },
  waitSeconds: 20,

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
