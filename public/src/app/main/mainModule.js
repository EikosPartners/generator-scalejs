import { registerTemplates } from 'scalejs.mvvm';
import $ from 'jquery';
import { observable } from 'knockout';
import ko from 'knockout';

import mainViewModel from './mainViewModel';
import mainTemplate from './main.html';

import './main.scss';

registerTemplates(mainTemplate);

export default function () {
    const main = mainViewModel(),
        showRoot = observable(true);

    // TESTING: Since karma does not expose its html file for running tests,
    // we need to make sure the dom is populated with render:root for stuff to get loaded into
    if (window.__KARMA_TESTING__) {
        const opacity = 0,
            showRootSet = localStorage.getItem('scalejs-karma-showRoot');
        // detected no render in dom
        $(document.body).addClass('pjson');
        $(document.body).prepend(`
                <button id="toggleRoot" style="
                            position: absolute;
                            top:0;
                            z-index:99999"
                         data-bind="click: function () {
                             showRoot(!showRoot());
                        }">Toggle Show Root</button>`);
        $(document.body).prepend(`
                <div
                    id="testRoot"
                    style="top: 20px;"
                    data-bind="
                        style: {
                            position: showRoot() ? 'relative' : 'absolute',
                            opacity: showRoot() ? 1 : ${opacity},
                            zIndex: showRoot()? 0: -1
                        },
                        render: testRoot">
                </div>`);

        const testRoot = observable(template('main_template', main));

        if (showRootSet) {
            showRoot(showRootSet === 'true');
        }
        showRoot.subscribe((value) => {
            localStorage.setItem('scalejs-karma-showRoot', value);
        });

        ko.applyBindings({ testRoot: testRoot, showRoot: showRoot }, document.getElementById("testRoot"));
        ko.applyBindings({ showRoot: showRoot }, document.getElementById("toggleRoot"));
    }
}