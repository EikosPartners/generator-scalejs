
module.exports = ( grunt ) ->
    options = grunt.file.readJSON 'grunt/.jslintrc'
    options.reporter = require 'jshint-stylish'

    options: options
    compile: ['src/app/**/*.js']

