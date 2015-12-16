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
            },
            {
                type: 'list',
                choices: [ 'PJSON driven', 'Statechart driven' ],
                name: 'type',
                message: 'What kind of application would you like to create?' 
            }];

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the scalejs application generator!'
        ));

        this.prompt(prompts, function (props) {
            this.name = props.name;
            this.type = props.type;
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
                
        makeApp: function() {
            //Get all files from a directory
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
            
            //Copy all files from one directory to another
            function copyAll( src, dest ){
                getFiles(this.sourceRoot() + '/' + src)
                .forEach(function (fileName) {
                    fileName = fileName.replace(this.sourceRoot() + '/' + src, '');
                    this.fs.copyTpl(
                        this.templatePath(src + '/' + fileName),
                        this.destinationPath(dest + '/' + fileName),
                        this.context
                    );
                }.bind(this));
            }
            
            var boundCopyAll = copyAll.bind(this);
            
            var type;
            if( this.type === 'Statechart driven' ) {
                type = 'Statechart';
            }
            else {
                type = 'PJSON';
            }    

            var gruntPath = 'grunt';
            boundCopyAll( gruntPath, gruntPath );
            
            var srcPath = 'src'+type;
            boundCopyAll( srcPath, 'src' ); 
            
            var testPath = 'test';
            boundCopyAll( testPath, testPath ); 
                       
            var rootPath = 'root';
            boundCopyAll( rootPath, '' );
            
        }
    },

    install: {
        packages: function () {
            this.installDependencies();
        }
    },

    end: {
      updateConfig: function(){
            //Update rjsconfig for pjson
            if(this.type === 'PJSON driven')
            {
                var _ = require('lodash'),
                    esprima = require('esprima'),
                    escodegen = require('escodegen'),
                    filePath = './rjsconfig.js',
                    additionalConfig = {
                        scalejs: {
                            extensions: [
                                'scalejs.mvvm',
                                'scalejs.metadataFactory'
                            ]
                        },
                        map: {
                            '*': {
                                sandbox: 'scalejs.sandbox',
                                bindings: 'scalejs.mvvm.bindings',
                                views: 'scalejs.mvvm.views'
                            }
                        },
                        paths: {
                            chai: '../bower_components/chai/chai',
                            mocha: '../bower_components/mocha/mocha'
                        },
                        shim: {
                            chai: {
                                exports: 'chai'
                            },
        
                            mocha: {
                                init: function () {
                                    this.mocha.setup('bdd');
                                    this.mocha.reporter('html');
                                    return this.mocha;
                                }
                            }
                        }
                    },
                    fileString,
                    parsedFile,
                    parsedConfig,
                    jsonifiedParsedConfig,
                    mergedConfig,
                    newConfig,
                    finalFile;
        
                fileString = fs.readFileSync(filePath, "utf8");
                parsedFile = esprima.parse(fileString);
                parsedConfig = parsedFile.body[0].expression.arguments[0];
                jsonifiedParsedConfig = eval('(' + escodegen.generate(parsedConfig) + ')');
                mergedConfig = _.merge(additionalConfig, jsonifiedParsedConfig, function(a, b) {
                    if (_.isArray(a)) {
                        return _.uniq(a.concat(b));
                    }
                });
                parsedFile.body[0].expression.arguments[0] = esprima.parse('(' + JSON.stringify(mergedConfig) + ')').body[0].expression
                finalFile = escodegen.generate(parsedFile);
                finalFile = '/*jshint ignore:start*/\n' + finalFile;
                finalFile += '\n/*jshint ignore:end*/\n';
                fs.writeFile(filePath, finalFile, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                });
            }
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