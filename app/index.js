'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var ScalejsGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the scalejs application generator!'
    ));

    var prompts = [{
      name: 'name',
      message: 'What is the name of your application?'
    },{
      type: 'confirm',
      name: 'less',
      message: 'Would you like to use less?',
      default: false
    },{
      type: 'confirm',
      name: 'coffee',
      message: 'Would you like to use coffee?',
      default: false
    },{
      type: 'confirm',
      name: 'visualstudio',
      message: 'Would you like to use visualstudio?',
      default: false
    }];

    this.prompt(prompts, function (props) {
      this.name = props.name;
      this.less = props.less;
      this.coffee = props.coffee;
      this.visualstudio = props.visualstudio;

      done();
    }.bind(this));
  },

  writing: {
    root: function () {
      var context = {
        site_name: this.name,
        coffee_enabled: this.coffee,
        less_enabled: this.less
      };

      this.src.copy('_root_package.json',       'package.json',       context);
      this.src.copy('_root_bower.json',         'bower.json',         context);

      this.src.copy('_root_index.html',         'index.html',         context);
      this.src.copy('_root_index.debug.html',   'index.debug.html',   context);
      this.src.copy('_root_index.release.html', 'index.release.html', context);
    },
    app: function () {
      this.dest.mkdir('app');

      var context = {
          site_name: this.name,
          coffee_enabled: this.coffee,
          less_enabled: this.less
      }

      if (this.coffee) {
          this.src.copy('_app_app.coffee',      'app/app.coffee',     context);
      } else {
          this.src.copy('_app_app.js',          'app/app.js',         context);
      }
    },
    test: function () {
      this.dest.mkdir('test');

      var context = {
          site_name: this.name,
          coffee_enabled: this.coffee,
          less_enabled: this.less
      };

      this.src.copy('_test_index.test.html', 'test/index.test.html',  context);
      this.src.copy('_test_jasmine.css',     'test/jasmine.css',      context);
    },
    grunt: function () {
      this.dest.mkdir('grunt');

      var context = {
          site_name: this.name,
          coffee_enabled: this.coffee,
          less_enabled: this.less
      };

      if (this.coffee) {
        this.src.copy('_grunt_.coffeelintrc',   'grunt/.coffeelintrc');
      } else {
        this.src.copy('_grunt_.jshintrc',       'grunt/.jshintrc');
      }

      this.src.copy('_grunt_gruntfile.js',      'grunt/gruntfile.js', context);
    }

  },

  end: function () {
    this.installDependencies();
  }

});

module.exports = ScalejsGenerator;

