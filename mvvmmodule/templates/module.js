/*global define */
define([
    'sandbox!<%= name %>',
    'app/<%= name %>/viewmodels/<%= name %>ViewModel',
    'views!<%= name %>',
    'bindings!<%= name %>',
    'styles!<%= name %>'
], function (
    sandbox,
    <%= name %>ViewModel
) {
    'use strict';

    return function <%= name %>() {
        var // imports
            root = sandbox.mvvm.root,
            template = sandbox.mvvm.template,
            registerStates = sandbox.state.registerStates,
            state = sandbox.state.builder.state,
            onEntry = sandbox.state.builder.onEntry,
            // vars
            viewModel = <%= name %>ViewModel();

        // Register application state for the module.
        registerStates('root',
            state('app',
                state('<%= name %>',
                    onEntry(function () {
                        // Render viewModel using '<%= name %>_template' template 
                        // (defined in <%= name %>.html) and show it in the `root` region.
                        root(template('<%= name %>_template', viewModel));
                    }))));
    };
});