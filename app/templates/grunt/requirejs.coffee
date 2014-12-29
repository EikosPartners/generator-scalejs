
module.exports = ( grunt, options ) ->

    analysis = require 'rjs-build-analysis'

    _package = options.package.name
    _version = options.package.version

    _name = _package + '-' + _version

    build:
        options:
            name: 'almond'
            include: ['../rjsconfig', 'app/app']
            mainConfigFile: 'rjsconfig.js'
            out: 'build/' + _name + '.js'
            optimize: 'none'
            done: ( done, output ) ->
                duplicates = analysis.duplicates output

                if duplicates.length > 0
                    grunt.log.subhead 'Duplicates found in requirejs build: '
                    grunt.log.warn duplicates
                    done new Error 'r.js build duplicate modules, please check the excludes option.'
                else
                    done()

