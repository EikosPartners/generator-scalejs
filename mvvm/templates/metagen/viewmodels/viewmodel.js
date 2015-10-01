/*global define */
define([
    'scalejs.sandbox!<%= name %>',
], function (
    sandbox
) {
    'use strict';

    return function (node) {
        var observable = sandbox.mvvm.observable,
            merge = sandbox.object.merge,
            text = observable(node.text);

        return merge(node, {
            text: text
        });
    };
});
