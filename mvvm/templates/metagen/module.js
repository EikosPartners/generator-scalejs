/*global define */
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
        var registerViewModels = sandbox.metadataFactory.registerViewModels;
        
        registerViewModels({
            <%= name %>: <%= name %>ViewModel
        });
    };
});