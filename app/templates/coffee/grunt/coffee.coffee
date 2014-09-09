
module.exports =

    options:
        bare: true

    compile:
        expand: true
        flatten: false
        cwd: 'src/app'
        dest: 'src/app'
        src: ['*.coffee']
        ext: '.js'

