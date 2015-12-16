/* global require */
require([
    'app/modules',
    'scalejs!application/app/main/mainModule'
], function (
    modules,
    app
) {
    'use strict';
    
    app.registerModules.apply(null,modules);
    
    app.run();
});
