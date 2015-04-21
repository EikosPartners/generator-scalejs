#<%= site_name  %>#

## Set up

### Requirements
* npm
* grunt
* bower

### Installing requirements
#### Windows
1. download and install chocolatey, a package manager for windows (https://chocolatey.org/), using the powershell command on the site
2. run `choco install nodejs.install` to install nodejs and npm
3. run `npm i -g npm` to update npm
4. run `npm i -g grunt-cli bower` to install grunt and bower

#### Linux
1. install nodejs/npm from your package manager
2. run `npm i -g npm` to update npm
3. run `npm i -g grunt-cli bower` to install grunt and bower

### Installing dependencies
1. cd into the root of the project
2. run `npm install` to install build dependencies
3. run `bower install` to install development dependencies

### Running the project
1. cd into the root of the project
2. run `grunt debug` to start a web server on http://0.0.0.0:9002
3. navigate to http://localhost:9002 in a web browser

### Creating a build
1. run `grunt build`
2. update the readme with the changes you made and the build number
3. remove the old build files and rename the new ones with the version number
4. update index.html to point to the correct file
5. commit and push the changes on the develop branch
