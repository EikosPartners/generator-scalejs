import { observable } from 'knockout';
import { ajax } from 'dataservice';

export default function main() {
    const metadata = observable();

    ajax('/pjson?name=pages/helloworld').then((data) => {
        metadata(data);
    });

    return {
        metadata
    };
}