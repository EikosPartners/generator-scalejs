/*global define,sandbox,mainViewModel */
define([
    'scalejs.sandbox!main',
    'app/main/viewmodels/mainViewModel',
    'bindings!main',
    'views!main'
], function (
    sandbox,
    mainViewModel
) {
    'use strict';

    return function main() {
		var root = sandbox.mvvm.root;
		var template = sandbox.mvvm.template;
		var main = mainViewModel();
        
        var metadata = {
            "type":"template",
            "template":"text_template",
            "text":"Hello World!"
        };

        main.metadata([metadata]);
        // populate the root with the main template
		root(template('main_template', main));    
    };
});