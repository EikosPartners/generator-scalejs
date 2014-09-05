
module.exports = function ( grunt ) {

    var pkg    = grunt.file.readJSON('../package.json');

    var coffee = <%= coffee_enabled %>;
    var less   = <%= less_enabled %>;

}
