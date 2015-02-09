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
        var modulePath = 'src/app/',
            context = { name: this.name };

        this.fs.copyTpl(
            this.templatePath('module.js'),
            this.destinationPath(modulePath + this.name + '/' + this.name + 'Module.js'),
            context
        );
    }

});