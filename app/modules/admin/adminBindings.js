import { createViewModel } from 'scalejs.metadataFactory';
import { observable } from 'knockout';
import sandbox from 'scalejs.sandbox';

export default {
    'admin-remove-action': function (ctx) {
        var data = observable({
            username: this.getValue('username')
        });

        return {
            click: function () {
                createViewModel.call({
                    data: data
                }, ctx.$parent.deleteAction).action();
            }
        };
    }
}
