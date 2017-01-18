// Scalejs Profile Services Generator.
var Generator = require('yeoman-generator'),
    yosay = require('yosay'),
    ncp = require('ncp');

module.exports = class extends Generator {

    prompting() {
        // Check if we're being called from the main app generator or not.
        if (this.options.fromMain) {
            console.log("Installing profile services...");
        } else {
            console.log(yosay("Welcome to the scalejs Profile Services generator!"));
        }
    }
};
