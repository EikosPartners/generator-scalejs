/*global define,sandbox,<%= name %>ViewModel */
define([
    'scalejs.sandbox!<%= name %>',
    'app/<%= name %>/viewmodels/<%= name %>ViewModel',
    'bindings!<%= name %>',
    'views!<%= name %>'
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
            <%= name %> = <%= name %>ViewModel(sandbox);

        // Register application state for the module.
        registerStates('root',
            state('app',
                state('<%= name %>',
                    onEntry(function () {
                        // Render viewModel using '<%= name %>_template' template 
                        // (defined in <%= name %>.html) and show it in the `root` region.
                        <%= name %>.text('Hello World from <%= name %>!');
                        root(template('<%= name %>_template', <%= name %>));
                    }))));
    };
});