
module.exports = function ( grunt ) {

    // measure the time of each task
    require('time-grunt')(grunt);

    // load grunt config
    require('load-grunt-config')(grunt, {
        data: {
            coffee_enabled: <%= coffee %>,
            less_enabled:   <%= less   %>
        }
    });

};

