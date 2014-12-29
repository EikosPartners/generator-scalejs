require.config({
    paths: {
        boot: '../bower_components/jasmine/boot',
        'jasmine-html': '../bower_components/jasmine/jasmine-html',
        jasmine: '../bower_components/jasmine/jasmine',
        '<%=site_name%>': '../build/<%=site_name%>'
    },
    shim: {
        jasmine: {
            exports: 'window.jasmineRequire'
        },
        'jasmine-html': {
            deps: [
                'jasmine'
            ],
            exports: 'window.jasmineRequire'
        },
        boot: {
            deps: [
                'jasmine',
                'jasmine-html'
            ],
            exports: 'window.jasmineRequire'
        }
    },
    scalejs: {
        extensions: [
        ]
    }
});

require(['boot'], function () {
    require ([
        // TESTS HERE
    ], function () {
        window.onload();
    });
});
