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

    writing: function () {
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

    install: function () {
        this.bowerInstall(['lisovin/scalejs.mvvm#dev'], {'save': true});
        this.bowerInstall(['lisovin/scalejs.statechart-scion#dev'], {'save': true});
    },

    end: function () {
        this.spawnCommand('grunt', ['config']);

        this.log("Run 'grunt debug' to launch a local server");
    }

});