module.exports = (grunt, options) ->
    release:
        options:
            process: (content, srcpath) ->
                if /index\.html$/i.test(srcpath)
                    grunt.log.ok('package', options.package.name)
                    content.replace(/^.*require.js.*$\n/gm, '')
                           .replace(/^.*rjsconfig.js.*$\n/gm, '')
                           .replace(/["']app\/app\.js["']/gm, '"js/' + options.package.name + '.min.js"')
                else content
        files: [
            expand: true
            flatten: true
            src: 'src/index.html'
            dest: 'dist'
           ,
            expand: true
            flatten: true
            src: ['build/<%= package.name %>.js', 'build/<%= package.name %>.min.js']
            dest: 'dist/js'
        ]
