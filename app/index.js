'use strict';
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    yosay = require('yosay'),
    _ = require('lodash'),
    fs = require('fs'),
    langs = [
        {
            name: 'javascript',
            extension: '.js'
        },
        {
            name: 'coffeescript',
            extension: '.coffee'
        }/*,
        {
            name: 'ECMAscript 6',
            extension: '.es6'
        }*/
    ];

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.pkg = require('../package.json');
    },

    prompting: function () {
        var done = this.async(),
            prompts = [{
                name: 'name',
                message: 'What is the name of your application?'
            }];

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the scalejs application generator!'
        ));

        this.prompt(prompts, function (props) {
            this.name = props.name;
            this.context = {
                site_name: this.name,
            };

            done();
        }.bind(this));
    },
	
	configuring: {
		saveLanguagePreference: function () {
			this.config.set('lang', this.lang);
		},
		
		saveAppName: function () {
			this.config.set('name', this.name);
		}
	},

    writing: {
        all: function () {
            function getFiles(dir, files_) {
                files_ = files_ || [];
                var files = fs.readdirSync(dir);
                for (var i in files) {
                    var name = dir + '/' + files[i];
                    if (fs.statSync(name)
                        .isDirectory()) {
                        getFiles(name, files_);
                    } else {
                        files_.push(name);
                    }
                }
                return files_;
            }

            getFiles(this.sourceRoot())
            .forEach(function (fileName) {
                fileName = fileName.replace(this.sourceRoot(), '');
                this.fs.copyTpl(
                    this.templatePath(fileName),
                    this.destinationPath(fileName),
                    this.context
                );
            }.bind(this));
            // To stop error when running bower install initially
            this.fs.move(this.destinationPath('.bowerrc'), this.destinationPath('.temp_bowerrc'));
        }
    },

    install: {
        packages: function () {
            this.installDependencies();
        }
    },

    end: {

        hookToBower: function () {
            fs.rename('.temp_bowerrc', '.bowerrc', function (err) {
                if (err) throw err;
                });
        },

        configure: function () {
            this.spawnCommand('grunt', ['config']);
        },

        message: function () {
            this.log('');
            this.log('Generation Finished!')
            this.log("Run 'grunt debug' to launch a local server");
        }
    }

});