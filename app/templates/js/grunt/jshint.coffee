
module.exports = ( grunt ) ->
    options = grunt.file.readJSON '.jshintrc'
    options.reporter = require 'jshint-stylish'

    options: options
    compile: ['src/app/**/*.js']

