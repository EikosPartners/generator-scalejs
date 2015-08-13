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
        }];

        this.prompt(prompts, function (props) {
            this.name = props.name;
            done();
        }.bind(this));
    },

    writing: {
        makeModule: function () {
            var modulePath = 'src/app/' + this.name + '/',
                context = { name: this.name };

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
        },
        updateConfig: function () {
            //Add statechart and mvvm extensions and mappings to the rjs config
            var fs = require('fs'),
                _ = require('lodash'),
                esprima = require('esprima'),
                escodegen = require('escodegen'),
                filePath = './rjsconfig.js',
                additionalConfig = {
                    scalejs: {
                        extensions: [
                            'scalejs.mvvm',
                            'scalejs.statechart-scion'
                        ]
                    },
                    map: {
                        '*': {
                            sandbox: 'scalejs.sandbox',
                            bindings: 'scalejs.mvvm.bindings',
                            views: 'scalejs.mvvm.views'
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

    install: {

        packages: function () {
            this.bowerInstall(['EikosPartners/scalejs.mvvm'], {'save': true});
            this.bowerInstall(['EikosPartners/scalejs.statechart-scion'], {'save': true});
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