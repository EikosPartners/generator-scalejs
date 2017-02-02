import { observable } from 'knockout';
import { ajax } from 'dataservice';

import { receive } from 'scalejs.messagebus';

export default function main() {
    const metadata = observable();

    receive('hot-render', () => {
        console.log("MainViewModel reloaded");
        metadata.valueHasMutated();
    });

    ajax('/pjson?name=pages/helloworld').then((data) => {
        metadata(data);
    });

    return {
        metadata
    };
}