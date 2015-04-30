var fs = require('fs');
var child_process = require('child_process');
var extender = require('rjs-extender');

process.argv.slice(2)
    .forEach(function (component) {
        var path = './bower_components/' + component + '/rjs.json';
        console.log(component);
        fs.lstat(path, function(err, stats) {
            if (!err && stats.isFile()) {
                extender('./rjsconfig.js', require(path));
            }
        });
    });

child_process.exec('grunt config', function (error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});