import { registerBindings, registerTemplates } from 'scalejs.mvvm';
import { registerViewModels } from 'scalejs.metadataFactory';

import adminBindings from './adminBindings';
import adminTemplate from './admin.html';

import './admin.scss';

registerTemplates(adminTemplate);
registerBindings(adminBindings);

registerViewModels({
    admin: function (node) {
        console.log('[adminModule] admin templates and bindings are loaded');
    }
});