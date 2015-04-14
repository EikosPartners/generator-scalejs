
module.exports =

    options:
        bare: true

    extension:
        expand: true
        flatten: false
        cwd: 'src'
        dest: 'src'
        src: ['*.coffee']
        ext: '.js'

    test:
        expand: true
        flatten: false
        cwd: 'test'
        dest: 'test'
        src: ['*.coffee']
        ext: '.js'

