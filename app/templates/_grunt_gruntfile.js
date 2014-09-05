
module.exports = function ( grunt ) {

    var pkg    = grunt.file.readJSON('../package.json');

    var coffee_enabled = <%= coffee_enabled %>;
    var less_enabled   = <%= less_enabled %>;

    var coffee      = { },
        coffeelint  = { },
        jshint      = { },
        requirejs   = { },
        bower       = { },
        uglify      = { },
        copy        = { };

    if (coffee) {
        coffee['options'] = {
            bare: true
        }
        coffee['compile'] = {
            expand: true,
            flatten:true,
            cwd: '../app',
            dest:'../bin',
            source:['*.coffee'],
            ext: '.js'

        },
        coffeelint['options'] = {
            configFile: '.coffeelintrc'
        }
        coffeelint['compile'] = [
            '../app/**/*.coffee'
        ]

    }

    jshint['options'] = grunt.file.readJSON('.jshintrc');
    jshint['options'].reporter = require('jshint-stylish');
    jshint['compile'] = [
        '../app/**/*.js'
    ]

    copy['compile'] = {
        files: [{
            expand: true,
            flatten:false,
            src: ['../app/**/*.js'],
            dest: '../bin/',
            filter: 'isFile'
        }]
    }


    var config = {
        pkg: pkg,
        coffee: coffee,
        coffeelint: coffeelint,
        jshint: jshint,
        requirejs: requirejs,
        bower: bower,
        uglify: uglify,
        copy: copy
    }

    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');

    var src = '';
    if (coffee_enabled) {
        grunt.loadNpmTasks('grunt-contrib-coffee');
        grunt.loadNpmTasks('grunt-coffeelint');

        grunt.registerTask('compile', ['coffeelint','jshint','coffee','copy']);
    } else {
        grunt.registerTask('compile', ['jshint',['copy']]);
    }

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-bower-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');


}
