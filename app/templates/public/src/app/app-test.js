// app-test.js specific imports
// imports to add to the window
import { getCurrent } from 'scalejs.navigation';
import ko from 'knockout';
import $ from 'jquery';
// app.js imports
import 'scalejs.extensions';
import app from 'scalejs.application';
import 'app/modules';
import mainModule from './main/mainModule';

window.$ = $;
window.appBundle = {
    getCurrent: getCurrent,
    ko: ko
};

$.ajax({
    type: 'POST',
    url: 'http://localhost:3000/auth/login',
    data: {
        username: 'admin',
        password: 'pass'
    },
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    },
    success: function (res) {
        console.log(res);
        mainModule();
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.error('Failed to authenticate', textStatus, errorThrown);
        app.registerModules(mainModule);
        app.run();
    }
});