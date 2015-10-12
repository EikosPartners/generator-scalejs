'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({

    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the scalejs module generator!'
        ));

        var prompts = [{
            name: 'name',
            message: 'What is the name of your module?'
        },{
            type: 'list',
            choices: [ 'Statechart driven', 'Metadata driven' ],
            name: 'metadata',
            message: 'What kind of module would you like to create?'
        }];

        this.prompt(prompts, function (props) {
            this.name = props.name;
            this.metadata = props.metadata;
            done();
        }.bind(this));
    },

    writing: {
        makeModule: function () {
            console.log( this.metadata );
            //Set root to correct template
            if( this.metadata === 'Metadata driven' )
            {
                this.sourceRoot( this.templatePath( 'metagen' ) );
            }
            else
            {
                this.sourceRoot( this.templatePath( 'statechart' ) );
            }

            var modulePath = 'src/app/' + this.name + '/',
                context = { name: this.name };
            var testPath = 'test/';
            this.fs.copyTpl(
                this.templatePath('module.js'),
                this.destinationPath(modulePath + this.name + 'Module.js'),
                context
            );

            this.fs.copyTpl(
                this.templatePath('bindings/bindings.js'),
                this.destinationPath(modulePath + 'bindings/' + this.name + 'Bindings.js'),
                context
            );

            this.fs.copyTpl(
                this.templatePath('viewmodels/viewmodel.js'),
                this.destinationPath(modulePath + 'viewmodels/' + this.name + 'ViewModel.js'),
                context
            );

            this.fs.copyTpl(
                this.templatePath('views/name.html'),
                this.destinationPath(modulePath + 'views/' + this.name + '.html'),
                context
            );
            
            this.fs.copyTpl(
                this.templatePath('tests/ViewModelSpec.js'),
                this.destinationPath(testPath + 'tests/' + this.name + 'ViewModelSpec.js'),
                context
            );
            
            
        },
        updateConfig: function () {
            //Add statechart and mvvm extensions and mappings to the rjs config
            var extension;
            if( this.metadata === 'Metadata driven' )
            {
                extension = 'scalejs.metadata-factory';
            }
            else
            {
                extension = 'scalejs.statechart-scion';
            }

            var fs = require('fs'),
                _ = require('lodash'),
                esprima = require('esprima'),
                escodegen = require('escodegen'),
                filePath = './rjsconfig.js',
                additionalConfig = {
                    scalejs: {
                        extensions: [
                            'scalejs.mvvm',
                            extension
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
        },
        updateTests: function(){
            var hook = "/*========Yeoman Hook=======*/",
                testMainPath = './test/karma_config/test-main.js',
                testRunnerPath = './test/testRunner.js',
                testMain = this.readFileAsString(testMainPath),
                testRunner = this.readFileAsString(testRunnerPath),
                insertTestMain = "    '"+this.name+"ViewModel' : '../src/app/"+this.name+"/viewmodels/"+this.name+"ViewModel',",
                insertTestRunner = "         'tests/"+this.name+"ViewModelSpec'",
                slug = testRunner.replace(/(\r\n|\n|\r)/gm,"");
                
                if(testMain.indexOf(hook)===-1){
                    console.log("Yeoman Hook missing from test-main.js");
                }
                else if(testRunner.indexOf(hook)===-1){
                    console.log("Yeoman Hook missing from testRunner.js");
                }
                else{
                    //checks if there are no existing modules in tests array
                    if ((slug.indexOf('/*========Yeoman Hook=======*/];')===-1)){
                        insertTestRunner += ',';
                    }
                    this.conflicter.force = true;
                    this.write(testMainPath, testMain.replace(hook, hook + '\n' + insertTestMain));
                    this.write(testRunnerPath, testRunner.replace(hook, hook + '\n' + insertTestRunner));
                }
                
        }

    },

    install: {

        packages: function () {
            this.bowerInstall(['EikosPartners/scalejs.mvvm'], {'save': true});
            if( this.metadata === 'Statechart driven' ){
                this.bowerInstall(['EikosPartners/scalejs.statechart-scion'], {'save': true});
            }
            this.bowerInstall(['EikosPartners/scalejs.reactive'], {'save': true});
            this.bowerInstall(['chai'], {'save-dev':true});
            this.bowerInstall(['mocha'], {'save-dev':true});
        }
    },

    end: {
        
        configure: function () {
            this.spawnCommand('grunt', ['config']);
        },
        
        message: function () {
            this.log('');
            this.log('Generation Finished!')
            this.log("Run 'grunt debug' to launch a local server");
            this.log("Don't forget to include this module somewhere!")
        }
    }

});