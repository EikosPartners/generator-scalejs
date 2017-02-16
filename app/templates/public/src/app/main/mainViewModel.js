import { root, template } from 'scalejs.mvvm';
import { observable } from 'knockout';
import { ajax } from 'dataservice';
{{global_nav_import}}

import { receive } from 'scalejs.messagebus';

export default function main() {
    const metadata = {{metadata_value}};
    {{header_var}}

    receive('hot-render', () => {
        console.log("MainViewModel reloaded");
        metadata.valueHasMutated();
    });

    {{header_ajax}}

    ajax('/pjson?name=pages/helloworld').then((data) => {
        metadata(data);
    });

    {{root_code}}
}