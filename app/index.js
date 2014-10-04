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
      type: 'list',
      name: 'less',
      message: 'Would you like to use css or less?',
      choices: ['css', 'less']
    },{
      type: 'list',
      name: 'coffee',
      message: 'Would you like to use js or coffee?',
      choices: ['js', 'coffee']
    },{
      type: 'list',
      name: 'ide',
      message: 'Which ide would you like to use?',
      choices: ['none', 'visualstudio']
    }];

    this.prompt(prompts, function (props) {
      this.name   = props.name;
      this.less   = props.less === 'less';
      this.coffee = props.coffee === 'coffee';
      this.ide    = props.ide;

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

      this.template('shared/package.json', 'package.json', context);
      this.template('shared/bower.json', 'bower.json', context);
      this.template('shared/.bowerrc', '.bowerrc', context);
      this.src.copy('shared/rjsconfig.js', 'rjsconfig.js');
      this.src.copy('shared/.gitattributes', '.gitattributes');
      this.src.copy('shared/.gitignore', '.gitignore');

      this.dest.mkdir('src');
    },
    app: function () {
      this.dest.mkdir('src/app');

      var context = {
          site_name: this.name,
          coffee_enabled: this.coffee,
          less_enabled: this.less
      };

      if (this.coffee) {
          this.template('coffee/src/app/app.coffee', 'src/app/app.coffee', context);
      } else {
          this.template('js/src/app/app.js', 'src/app/app.js', context);
      }

      this.template('shared/src/index.html', 'src/index.html', context);
    },
    test: function () {
      this.dest.mkdir('test');

      var context = {
          site_name: this.name,
          coffee_enabled: this.coffee,
          less_enabled: this.less
      };

      this.template('shared/test/index.html', 'test/index.html', context);
      this.template('shared/test/all.tests.js', 'test/all.tests.js', context);
    },
    grunt: function () {
      this.dest.mkdir('grunt');

      this.src.copy('shared/gruntfile.js', 'gruntfile.js');

      if (this.coffee) {

        this.src.copy('coffee/.coffeelintrc', '.coffeelintrc');
        this.src.copy('coffee/grunt/coffee.coffee', 'grunt/coffee.coffee');
        this.src.copy('coffee/grunt/coffeelint.coffee', 'grunt/coffeelint.coffee');

        this.src.copy('coffee/grunt/aliases.yaml', 'grunt/aliases.yaml');

      } else {

        this.src.copy('js/.jslintrc', '.jslintrc');
        this.src.copy('js/grunt/jshint.coffee', 'grunt/jshint.coffee');

        this.src.copy('js/grunt/aliases.yaml', 'grunt/aliases.yaml');

      }

      this.src.copy('shared/grunt/bower.coffee', 'grunt/bower.coffee');
      this.src.copy('shared/grunt/requirejs.coffee', 'grunt/requirejs.coffee');
      this.src.copy('shared/grunt/connect.coffee', 'grunt/connect.coffee');
      this.src.copy('shared/grunt/uglify.coffee', 'grunt/uglify.coffee');
      this.src.copy('shared/grunt/copy.coffee', 'grunt/copy.coffee');
      this.src.copy('shared/grunt/curl-dir.coffee', 'grunt/curl-dir.coffee');
    }

  },

  end: function () {
    this.installDependencies();
  }

});

module.exports = ScalejsGenerator;

