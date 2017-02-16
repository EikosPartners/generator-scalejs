// Scalejs App generator
let Generator = require('yeoman-generator'),
    yosay = require('yosay'),
    path = require('path'),
    ncp = require('ncp'),
    fsExtra = require('fs-extra'),
    fs = require('fs'),
    npmAddScript = require('npm-add-script'),
    mkdirp = require('mkdirp'),
    fsw = require('ep-utils').fsWrapper;

const NPM_DEPENDENCIES = require('./dependencies'),
      EXTRAS_PROFILE = "Profile Services",
      EXTRAS_DATASERVICE = "Custom Data Service",
      EXTRAS_FONT_ICON = "Font Icon",
      EXTRAS_TESTING= "Karma Tests",
      EXTRAS_TINGOOSE = "Tingoose",
      EXTRAS_GLOBAL_NAV = "Global Navigation Services",
      EXTRAS_ADMIN = "Admin Panel";

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
                choices: [EXTRAS_PROFILE, EXTRAS_TESTING, EXTRAS_TINGOOSE, EXTRAS_GLOBAL_NAV, EXTRAS_ADMIN]
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

                    // Determine whether to add tingoose services.
                    if (this.extras.includes(EXTRAS_TINGOOSE)) {
                        let tingoose_dep = "const tingoose = require('tingoose');\nconst collection = tingoose.collection;\nconst tingooseData = require('./data/data.json');";

                        let tingoose_code = "\n// For more info checkout the repo https://github.com/EikosPartners/tingoose\n";
                        tingoose_code += "// Load data into tingoose.\n";
                        tingoose_code += "tingoose.loadCollections([\n";
                        tingoose_code += "    {\n";
                        tingoose_code += "        name: 'data',\n";
                        tingoose_code += "        data: tingooseData,\n";
                        tingoose_code += "        defaultPath: './data/data.json'\n";
                        tingoose_code += "    }\n";
                        tingoose_code += "]);\n\n";
                        tingoose_code += "function findData(dataName) {\n";
                        tingoose_code += "    return new Promise( (resolve, reject) => {\n";
                        tingoose_code += "        collection[dataName]\n";
                        tingoose_code += "            .find()\n";
                        tingoose_code += "            .toArray()\n";
                        tingoose_code += "            .then( (results) => {\n";
                        tingoose_code += "                resolve(results);\n";
                        tingoose_code += "            })\n";
                        tingoose_code += "            .catch( (err) => {\n";
                        tingoose_code += "                reject(err);\n";
                        tingoose_code += "            });\n";
                        tingoose_code += "    });\n";
                        tingoose_code += "}\n";

                        servFile = servFile.replace('{{tingoose_code}}', tingoose_code);
                        servFile = servFile.replace('{{tingoose_deps}}', tingoose_dep);

                        // Create the data folder and data file.
                        mkdirp.sync(path.join(this.destinationRoot(), 'data/'));
                        fs.writeFileSync(path.join(this.destinationRoot(), 'data/data.json'), '[]');
                    } else {
                        servFile = servFile.replace('{{tingoose_deps}}', '');
                        servFile = servFile.replace('{{tingoose_code}}', '');
                    }

                    fs.writeFileSync(path.join(this.destinationRoot(), 'server.js'), servFile);

                    let globalNavPromise = new Promise( (resolve, reject) => {
                        let mainHTML = fs.readFileSync(path.join(this.destinationRoot(), 'public/src/app/main/main.html'), 'utf8'),
                            mainVM = fs.readFileSync(path.join(this.destinationRoot(), 'public/src/app/main/mainViewModel.js'), 'utf8'),
                            modulesFile = fs.readFileSync(path.join(this.destinationRoot(), 'public/src/app/modules.js'), 'utf8');

                        if (this.extras.includes(EXTRAS_GLOBAL_NAV)) {
                            ncp(path.join(this.sourceRoot(), '../modules/globalNavigation'), path.join(this.destinationRoot(), 'public/src/app/globalNavigation/'), (err) => {
                                // Add div with data bind of header to the main.html
                                mainHTML = mainHTML.replace('{{global_nav}}', '<div data-bind="metadataFactory: header"></div>');

                                // Add code to mainViewModel.
                                let headerCode = "ajax('/pjson?name=pages/header').then( data => {\n";
                                    headerCode += "       header(data);\n";
                                    headerCode += "   });\n";

                                let rootCode = "root(template('main_template', {\n";
                                    rootCode += "       metadata: metadata,\n";
                                    rootCode += "       header: header\n";
                                    rootCode += "   }));\n";

                                mainVM = mainVM.replace('{{global_nav_import}}', "import { layout } from 'scalejs.navigation';");
                                mainVM = mainVM.replace('{{metadata_value}}', 'layout.content');
                                mainVM = mainVM.replace('{{header_var}}', 'const header = observable();\n');
                                mainVM = mainVM.replace('{{header_ajax}}', headerCode);
                                mainVM = mainVM.replace('{{root_code}}', rootCode);

                                // Add import to modules file.
                                modulesFile = modulesFile.replace('{{global_nav_module}}', "import './globalNavigation/globalNavigationModule';");

                                // Write the files.
                                fs.writeFileSync(path.join(this.destinationRoot(), 'public/src/app/main/main.html'), mainHTML);
                                fs.writeFileSync(path.join(this.destinationRoot(), 'public/src/app/main/mainViewModel.js'), mainVM);
                                fs.writeFileSync(path.join(this.destinationRoot(), 'public/src/app/modules.js'), modulesFile);

                                // Copy over the header json.
                                fsExtra.copy(path.join(this.sourceRoot(), '../appJson/header.json'), path.join(this.destinationRoot(), 'server/pjson/pages/header.json'), (err, files) => {
                                    if (err) {
                                        console.error(err);
                                    }
                                    resolve();
                                });
                            });
                        } else {
                            // Replace template code in main.html
                            mainHTML = mainHTML.replace('{{global_nav}}', '');

                            // Replace template code in mainViewModel.
                            mainVM = mainVM.replace('{{global_nav_import}}', '');
                            mainVM = mainVM.replace('{{metadata_value}}', 'observable()');
                            mainVM = mainVM.replace('{{header_var}}', '');
                            mainVM = mainVM.replace('{{header_ajax}}', '');
                            mainVM = mainVM.replace('{{root_code}}', "root(template('main_template', { metadata: metadata }));\n");

                            // Replace modules file.
                            modulesFile = modulesFile.replace('{{global_nav_module}}', '');

                            // Write the files.
                            fs.writeFileSync(path.join(this.destinationRoot(), 'public/src/app/main/main.html'), mainHTML);
                            fs.writeFileSync(path.join(this.destinationRoot(), 'public/src/app/main/mainViewModel.js'), mainVM);
                            fs.writeFileSync(path.join(this.destinationRoot(), 'public/src/app/modules.js'), modulesFile);

                            resolve();
                        }
                    });

                    globalNavPromise.then( () => {
                        // Add admin code to the project after the globalNavigation code has been added because we have to make changes to global nav files if
                        // the user chose to add those services.
                        if (this.extras.includes(EXTRAS_ADMIN)) {
                            ncp(path.join(this.sourceRoot(), '../modules/admin'), path.join(this.destinationRoot(), 'public/src/app/admin'), () => {
                                if (this.extras.includes(EXTRAS_GLOBAL_NAV)) {
                                    let globalVM = fs.readFileSync(path.join(this.destinationRoot(), 'public/src/app/globalNavigation/globalNavigationViewModel.js'), 'utf8');
                                    // Load the globalNavigationViewModel and add the admin module to the lookup dictionary.
                                    let adminCode = "admin: function(done) {\n";
                                        adminCode += "  require.ensure([], function(require) {\n";
                                        adminCode += "      require('../admin/adminModule.js');\n";
                                        adminCode += "      done();\n";
                                        adminCode += "  });\n";
                                        adminCode += "},\n";

                                    globalVM = globalVM.replace('{{admin_module}}', adminCode);

                                    fs.writeFileSync(path.join(this.destinationRoot(), 'public/src/app/globalNavigation/globalNavigationViewModel.js'), globalVM);

                                    // Add the admin page to the header.json
                                    let headerJSON = fsw.fileToJsonSync(path.join(this.destinationRoot(), 'server/pjson/pages/header.json'));

                                    headerJSON[0].routes.push({
                                        "text": "Admin",
                                        "route": "admin/{options*}",
                                        "get": "pjson?name=pages/admin"
                                    });

                                    fsw.jsonToFileSync(path.join(this.destinationRoot(), 'server/pjson/pages/header.json'), headerJSON);
                                }

                                // Copy the admin json.
                                fsExtra.copy(path.join(this.sourceRoot(), '../appJson/admin.json'), path.join(this.destinationRoot(), 'server/pjson/pages/admin.json'), () => {
                                    resolve();
                                });
                            });
                        } else {
                            if (this.extras.includes(EXTRAS_GLOBAL_NAV)) {
                                let globalVM = fs.readFileSync(path.join(this.destinationRoot(), 'public/src/app/globalNavigation/globalNavigationViewModel.js'), 'utf8');
                                globalVM = globalVM.replace('{{admin_module}}', '');
                                fs.writeFileSync(path.join(this.destinationRoot(), 'public/src/app/globalNavigation/globalNavigationViewModel.js'), globalVM);
                            }

                            resolve();
                        }
                    });
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

            if (this.extras.includes(EXTRAS_TINGOOSE)) {
                deps.push('tingoose');
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
