'use strict';
/*jshint camelcase: false */
/* jshint -W024 */
/* jshint expr:true */
/* global mochaPhantomJS */

//Configure RequireJS
require.config({
    baseUrl: '../src',
    config: {
      'scalejs.mvvm': {
          doNotRender: true
      }
    },
    paths: {
      'test' : '../test',
      'scalejs.sandbox': '../bower_components/scalejs/dist/scalejs.min'
    },
    shim: {
        'mocha': {
            init: function() {
                this.mocha.setup('bdd');
                return this.mocha;
            }
        }
    }
});

// Require libraries
require([
    'require',
    'chai',
    'mocha'
], function (require, chai, mocha) {

    // Chai
    var assert = chai.assert;
    var should = chai.should();
    var expect = chai.expect;
    
    // New test files should be included in this array
    var tests = [
        // This hook is needed for the generator to add modules
        /*========Yeoman Hook=======*/];
    
    // Require base tests before starting
    require(tests, function (person) {
        mocha.setup({ globals: ['hasCert'] });

        // Start runner
        if (window.mochaPhantomJS) {
            mochaPhantomJS.run();
        }
        else { mocha.run(); }
    });

});


