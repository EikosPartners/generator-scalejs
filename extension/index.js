'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var ScalejsExtensionGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the scalejs extension generator!'
    ));

    var prompts = [{
      name: 'name',
      message: 'What is the name of your extension?'
    }];

    this.prompt(prompts, function (props) {
      this.name   = props.name;
      done();
    }.bind(this));
  },

  writing: {
    root: function () {
      var context = {
        ext_name: this.name
      };

      this.template('shared/package.json', 'package.json', context);
      this.template('shared/bower.json', 'bower.json', context);
      this.template('shared/.bowerrc', '.bowerrc', context);
      this.template('shared/.gitignore', '.gitignore', context);

      this.dest.mkdir('src');
    },
    app: function () {

      var context = {
          ext_name: this.name,
          ext_jsname: this.name.replace(/(^scalejs\.|-.*$)/g, '')
      };

      this.template('js/src/ext.js', 'src/' + this.name + '.js', context);
      this.src.copy('shared/rjsconfig.js', 'rjsconfig.js');
    },
    test: function () {
      this.dest.mkdir('test');

      var context = {
          ext_name: this.name,
          ext_jsname: this.name.replace(/(^scalejs\.|-.*$)/g, '')
      };

      this.template('js/test/ext.test.js', 'test/' + this.name + '.test.js', context);
      this.template('shared/test/index.html', 'test/index.html', context);
      this.template('shared/test/all.tests.js', 'test/all.tests.js', context);
    },
    grunt: function () {
      this.dest.mkdir('grunt');

      this.src.copy('shared/gruntfile.js', 'gruntfile.js');

      this.src.copy('js/.jslintrc', '.jslintrc');
      this.src.copy('js/grunt/jshint.coffee', 'grunt/jshint.coffee');

      this.src.copy('js/grunt/aliases.yaml', 'grunt/aliases.yaml');

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

module.exports = ScalejsExtensionGenerator;

