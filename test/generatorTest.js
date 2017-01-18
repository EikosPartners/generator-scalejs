var helpers = require('yeoman-test'),
    assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    ncp = require('ncp');

describe('GeneratorTest', () => {
    it('Test files created', () => {
        // Assert public and server directories created as well as server.js
        return helpers.run(path.join(__dirname, '../app'))
            .withPrompts({ shouldCreatePackage: false})
            .then( (dir) => {

                // Assert server file and webpack configs exist.
                assert.file(path.resolve(dir, 'server.js'));
                assert.file(path.resolve(dir, 'webpack.config.js'));

                // Assert server and public directories exist.
                assert.file(path.resolve(dir, 'public/'));
                assert.file(path.resolve(dir, 'server/'));
            });
    });
});
