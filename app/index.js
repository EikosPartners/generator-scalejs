// Scalejs App generator
let Generator = require('yeoman-generator'),
    yosay = require('yosay'),
    path = require('path'),
    ncp = require('ncp'),
    fs = require('fs'),
    npmAddScript = require('npm-add-script');

const NPM_DEPENDENCIES = require('./dependencies'),
      EXTRAS_PROFILE = "Profile Services",
      EXTRAS_DATASERVICE = "Custom Data Service",
      EXTRAS_FONT_ICON = "Font Icon",
      EXTRAS_TESTING= "Karma Tests";

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
                choices: [EXTRAS_PROFILE, EXTRAS_DATASERVICE, EXTRAS_FONT_ICON, EXTRAS_TESTING]
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
            let shouldCreate = new Promise( (resolve, reject) => {
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
            }).then( () => {
                // Try to add the linting script to the existing or newly created package.json.
                try {
                    npmAddScript({ key: "lint", value: "eslint ./public/src" });
                    npmAddScript({ key: "lint-all", value: "eslint ."});

                    if (this.extras.includes(EXTRAS_TESTING)) {
                        npmAddScript({ key: "test", value: "karma start test/karma_config/karma.config.js --timeout 15000" , force: true});
                    }

                } catch (e) {
                    if (e.code === 'ENOENT') {
                        console.log("There was an error trying to add a lint script to your package.json as it does not exist! You can manually add it later.");
                    }
                }

                resolve();
            });
        });
    }

    // Write scalejs files to the filesystem
    writing() {
        console.log("\nCopying over files...");
        // Copy all files from the public directory and the server.js file.
        return new Promise( (resolve, reject) => {

            if (this.extras.includes(EXTRAS_DATASERVICE)) {
                // Invoke dataservice generator.
                //this.composeWith('scalejs:dataservice', { fromMain: true });
            }

            if (this.extras.includes(EXTRAS_FONT_ICON)) {
                // Invoke font icon generator.
                //this.composeWith('scalejs:font_icon', { fromMain: true });
            }

            ncp(this.sourceRoot(), this.destinationRoot(), (err) => {
                if (err) {
                    console.error("There was an error:", err);
                    reject(err);
                } else {
                    let servFile = fs.readFileSync(path.join(this.destinationRoot(), 'server.js'), 'utf8');
                    // Determine whice extra services the user chose and copy accordingly.
                    if (this.extras.includes(EXTRAS_PROFILE)) {
                        let profile_dep = "const opensesameProfile = require('opensesame-profile');\n";

                        let profile_code = "\n//Check out the documentation and examples here https://github.com/EikosPartners/opensesame-profile";
                        profile_code += "\n//you can give opensesame-profile an express app object\n";
                        profile_code += "opensesameProfile({\n";
                        profile_code += "   secret: 'testSecret',\n";
                        profile_code += "   middleware: function (req, res, next) {\n";
                        profile_code += "       // Can do route authorization here.\n";
                        profile_code += "       next();\n";
                        profile_code += "   },\n";
                        profile_code += "   httpsOnly: false\n";
                        profile_code += "}, app);\n";

                        servFile = servFile.replace('{{profile_services}}', profile_code);
                        servFile = servFile.replace('{{extra_deps}}', profile_dep);

                    } else {
                        servFile = servFile.replace('{{profile_services}}', '');
                        servFile = servFile.replace('{{extra_deps}}', '');
                    }

                    fs.writeFileSync(path.join(this.destinationRoot(), 'server.js'), servFile);

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

            let deps = NPM_DEPENDENCIES.default_dependencies;

            if (this.extras.includes(EXTRAS_TESTING)) {
                deps.push.apply(deps, NPM_DEPENDENCIES.test_dependencies);
            }

            if (this.extras.includes(EXTRAS_PROFILE)) {
                deps.push('opensesame-profile');
            }

            return this.npmInstall(deps, { 'save': true});
        }
    }

    // Closing messages
    end() {
        console.log(yosay("Your project is set up!"));
        console.log("Run npm start to start the server and navigate to localhost:3000");
        console.log("\nIf you would like to configure PJSON, check out the server.js file and the pjson-loader package (https://github.com/EikosPartners/pjson-loader)");
    }
};
