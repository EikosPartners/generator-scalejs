
module.exports =

    options:
        bare: true

    compile:
        expand: true
        flatten: false
        cwd: 'src'
        dest: 'src'
        src: ['*.coffee']
        ext: '.js'

