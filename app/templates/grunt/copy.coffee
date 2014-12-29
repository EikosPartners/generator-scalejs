
module.exports = (grunt, options) ->

    _package = options.package.name
    _version = options.package.version

    _name = _package + '-' + _version

    release:
        options:
            process: (content, srcpath) ->
                if /index\.html$/i.test(srcpath)
                    grunt.log.ok('package', _package)
                    content.replace(/^.*require.js.*$\n/gm, '')
                           .replace(/^.*rjsconfig.js.*$\n/gm, '')
                           .replace(/["']app\/app\.js["']/gm, '"js/' +
                                _name + '.min.js"')
                else content
        files: [
            expand: true
            flatten: true
            src: 'src/index.html'
            dest: 'dist'
           ,
            expand: true
            flatten: true
            src: ['build/' + _name + '.js', 'build/' + _name + '.min.js']
            dest: 'dist/js'
        ]

