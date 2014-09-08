
module.exports =

    options:
        bare: true

    compile:
        expand: true
        flatten: false
        cwd: 'app'
        dest: 'bin'
        src: ['*.coffee']
        ext: '.js'

