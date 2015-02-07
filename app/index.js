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
            name: 'lang',
            message: 'Would you like to use js or coffee?',
            choices: ['js', 'coffee']
        }];

        this.prompt(prompts, function (props) {
            this.name = props.name;
            this.lang = props.lang;

            this.coffee = props.lang === 'coffee';
            this.js = props.lang === 'js';

            this.context = {
                site_name: this.name,
                coffee_enabled: this.coffee
            };

            done();
        }.bind(this));
    },
	
	configuring: {
		saveLanguagePreference: function () {
			this.config.set('lang', this.lang);
			console.log(this.config.get('lang'));
		},
		
		saveAppName: function () {
			this.config.set('name', this.name);
		}
	},

    writing: {
        root: function () {

            this.template('package.json', 'package.json', this.context);
            this.template('bower.json', 'bower.json', this.context);
            this.src.copy('rjsconfig.js', 'rjsconfig.js');
            this.src.copy('.gitattributes', '.gitattributes');
            this.src.copy('.ignore', '.gitignore');

            this.dest.mkdir('src');
        },
        app: function () {
            this.dest.mkdir('src/app');

            if (this.coffee) {
                this.template('src/app/app.coffee', 'src/app/app.coffee', this.context);
            } else {
                this.template('src/app/app.js', 'src/app/app.js', this.context);
            }

            this.template('src/index.html', 'src/index.html', this.context);
        },
        test: function () {
            this.dest.mkdir('test');

            this.template('test/index.html', 'test/index.html', this.context);
            this.template('test/all.tests.js', 'test/all.tests.js', this.context);
        },
        grunt: function () {
            this.dest.mkdir('grunt');

            this.src.copy('gruntfile.js', 'gruntfile.js');

            if (this.coffee) {

                this.src.copy('.coffeelintrc', '.coffeelintrc');
                this.src.copy('grunt/coffee.coffee', 'grunt/coffee.coffee');
                this.src.copy('grunt/coffeelint.coffee', 'grunt/coffeelint.coffee');

                this.src.copy('grunt/aliases.coffee.yaml', 'grunt/aliases.yaml');

            } else {

                this.src.copy('.jslintrc', '.jslintrc');
                this.src.copy('grunt/jshint.coffee', 'grunt/jshint.coffee');

                this.src.copy('grunt/aliases.js.yaml', 'grunt/aliases.yaml');

            }

            this.src.copy('grunt/bower.coffee', 'grunt/bower.coffee');
            this.src.copy('grunt/requirejs.coffee', 'grunt/requirejs.coffee');
            this.src.copy('grunt/connect.coffee', 'grunt/connect.coffee');
            this.src.copy('grunt/uglify.coffee', 'grunt/uglify.coffee');
            this.src.copy('grunt/copy.coffee', 'grunt/copy.coffee');
            this.src.copy('grunt/curl-dir.coffee', 'grunt/curl-dir.coffee');
        }

    },

    end: function () {
        this.installDependencies();
    }

});

module.exports = ScalejsGenerator;

