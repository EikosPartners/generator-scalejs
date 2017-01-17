// Yeoman generator
var Generator = require('yeoman-generator'),
    yosay = require('yosay'),
    path = require('path'),
    ncp = require('ncp'),
    fs = require('fs');

const SCALEJS_PUBLIC_DIR = 'public/',
      NPM_DEPENDENCIES = require('../dependencies');

module.exports = class extends Generator {
    // Set up prompts
    prompting() {
        console.log(yosay("Welcome to the scalejs 2.0 generator!"));

        // Prompt user for the project name, defaults to directory name
        const prompts = [
            {
                type: "confirm",
                name: "shouldCreatePackage",
                message: "Would you like to generate a package.json?",
                default: false
            }
        ];

        return this.prompt(prompts)
            .then( (answers) => {
                // Create a package.json if the user wants us to
                this.shouldCreatePackage = answers.shouldCreatePackage;
            });
    }

    // Configuring - Run npm init if user wants to generate package.json
    configuring() {
        return new Promise( (resolve, reject) => {
            if (this.shouldCreatePackage) {
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
        ncp(this.sourceRoot(), this.destinationRoot(), (err) => {
            if (err) {
                console.error("There was an error:", err);
            } else {
                console.log("Done copying files!");
            }
        });
    }

    // npm install dependencies
    install() {
        console.log("\nInstalling npm dependencies...\n");
        return this.npmInstall(NPM_DEPENDENCIES, { 'save': true});
    }

    // Closing messages
    end() {
        console.log(yosay("Your project is set up!"));
        console.log("Run npm start to start the server and navigate to localhost:3000");
        console.log("\nIf you would like to configure PJSON, check out the server.js file and the pjson-loader package (https://github.com/EikosPartners/pjson-loader)");
    }
};
