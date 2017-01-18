// Scalejs App generator
var Generator = require('yeoman-generator'),
    yosay = require('yosay'),
    path = require('path'),
    ncp = require('ncp'),
    fs = require('fs');

const NPM_DEPENDENCIES = require('../dependencies'),
      EXTRAS_PROFILE = "Profile Services",
      EXTRAS_DATASERVICE = "Custom Data Service",
      EXTRAS_FONT_ICON = "Font Icon",
      EXTRAS_HMR = "Hot Module Reloading";

module.exports = class extends Generator {
    // Set up prompts
    prompting() {
        console.log(yosay("Welcome to the scalejs 2.0 generator!"));

        // Prompt user for the project name, defaults to directory name
        const prompts = [
            {
                type: "checkbox",
                name: "extras",
                message: "Which additional services would you like added?",
                choices: [EXTRAS_PROFILE, EXTRAS_DATASERVICE, EXTRAS_FONT_ICON, EXTRAS_HMR]
            },
            {
                type: "confirm",
                name: "shouldCreatePackageJSON",
                message: "Would you like to generate a package.json?",
                default: false
            }
        ];

        return this.prompt(prompts)
            .then( (answers) => {
                // Create a package.json if the user wants us to
                this.shouldCreatePackageJSON = answers.shouldCreatePackageJSON;

                // Add the extra servies the user chose to the context.
                this.extras = answers.extras;
            });
    }

    // Configuring - Run npm init if user wants to generate package.json
    configuring() {
        return new Promise( (resolve, reject) => {
            if (this.shouldCreatePackageJSON) {
                console.log("\nBe sure to put server.js as the entry point or rename server.js to your entry point after completion.\n");
                var npmCmd = this.spawnCommand('npm', ['init']);

                // Wait for the npm init command to finish before resolving.
                npmCmd.on('close', (code) => {
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    // Write scalejs files to the filesystem
    writing() {
        console.log("\nCopying over files...");
        // Copy all files from the public directory and the server.js file.
        return new Promise( (resolve, reject) => {

            // Determine whice extra services the user chose and copy accordingly.
            if (this.extras.includes(EXTRAS_PROFILE)) {
                // Invoke the profile generator.
                this.composeWith('scalejs:profile', { fromMain: true });
            }

            if (this.extras.includes(EXTRAS_DATASERVICE)) {
                // Invoke dataservice generator.
                //this.composeWith('scalejs:dataservice', { fromMain: true });
            }

            if (this.extras.includes(EXTRAS_FONT_ICON)) {
                // Invoke font icon generator.
                //this.composeWith('scalejs:font_icon', { fromMain: true });
            }

            if (this.extras.includes(EXTRAS_HMR)) {
                // Invoke hmr generator.
                //this.composeWith('scalejs:hmr', { fromMain: true });
            }

            ncp(this.sourceRoot(), this.destinationRoot(), (err) => {
                if (err) {
                    console.error("There was an error:", err);
                    reject(err);
                } else {
                    console.log("Done copying files!");
                    resolve();
                }
            });
        });
    }

    // npm install dependencies
    install() {
        if (!this.options['skip-install']) {
            console.log("\nInstalling npm dependencies...\n");
            return this.npmInstall(NPM_DEPENDENCIES, { 'save': true});
        }
    }

    // Closing messages
    end() {
        console.log(yosay("Your project is set up!"));
        console.log("Run npm start to start the server and navigate to localhost:3000");
        console.log("\nIf you would like to configure PJSON, check out the server.js file and the pjson-loader package (https://github.com/EikosPartners/pjson-loader)");
    }
};
