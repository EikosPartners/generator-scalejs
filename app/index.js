// Yeoman generator
var Generator = require('yeoman-generator'),
    yosay = require('yosay');

module.exports = class extends Generator {
    prompting() {
        console.log(yosay("Welcome to the scalejs 2.0 generator!"));

        // Set up prompts here for any services that aren't default

        
    }
};
