/*global define,sandbox */
define([
    'scalejs.sandbox!main',
], function (
    sandbox
) {
    'use strict';

    return function (node) {
        var metadata = sandbox.mvvm.observable([]);

        return {
            metadata:metadata
        }
    };
});
