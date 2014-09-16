
module.exports =

    test:
        options:
            port: 9001
            keepalive: true
            debug: true
            base: [ 'test', '.' ]

    debug:
        options:
            port: 9002
            keepalive: true
            debug: true
            base: [ '.' ]

    release:
        options:
            port: 9003
            keepalive: true
            debug: true
            base: [ 'dist', '.' ]
