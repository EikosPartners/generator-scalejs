/*global define, sandbox, _, ko, templateViewModel */
define([
    'sandbox!template',
    'lodash',
    'scalejs.metadataFactory/template/templateViewModel',
    'bindings!app/template/text/textBindings',
    'views!app/template/text/text'
], function (
    sandbox,
    _,
    templateViewModel
) {
    'use strict';
        
    return function template() {
        sandbox.metadataFactory.registerViewModels({
            template: templateViewModel
        });
    };
});
