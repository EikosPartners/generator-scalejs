import { getRegisteredTypes } from 'scalejs.metadataFactory';
import { navigation, layout } from 'scalejs.navigation';
import sandbox from 'scalejs.sandbox';
import dataservice from 'dataservice';
import { merge } from 'scalejs';
import ko from 'knockout';

export default function globalNavigation(node) {
    var routes = ko.observableArray(node.routes),
        linkObjs = ko.observableArray(),
        navLinks = navigation.navLinks,
        activeLink = navigation.activeLink,
        currentPage;

    function walkGetTypes(nodes) {
        return (nodes || [])
            .reduce( (types, node) => types.concat([node.type])
            .concat(walkGetTypes(node.children)), []);
    }

    let resolveModuleLookup = {
        admin: function (done) {
            require.ensure([], function (require) {
                require('../../modules/admin/adminModule.js');
                done();
            });
        },
    };

    function resolveModule(moduleType, done = empty) {
        let resolveModuleFunc = resolveModuleLookup[moduleType];

        if (!resolveModuleFunc) {
            console.log('Module not found:', moduleType);
            return;
        }

        resolveModuleFunc(done);
    }

    function loadMetadata(name) {
        currentPage = name.replace('pjson?name=pages/',''); // parse out name from route

        dataservice.ajax({ 'uri': name }, function (err, metadata) {
            if (err) {
                return;
            }
            var types = _.uniq(walkGetTypes(Array.isArray(metadata) ? metadata : [metadata])).filter(function (type) {
                return type && getRegisteredTypes().indexOf(type) === -1;
            });
            console.log('Missing types:', types);

            if (types.length === 0) {
                layout.content(metadata);
            } else {
                let counter = 0;

                types.forEach(function (type) {
                    resolveModule(type, function () {
                        counter++;
                        if (counter === types.length) {
                            //we loaded all the types! now we can load metadata
                            layout.content(metadata);
                        }
                    });
                });
            }
        });
    }

    console.log("hello world");

    routes().forEach(function (route) {
        navigation.addNav(route, function (routeInfo) {
            var name = route.get.replace('{path}', routeInfo.path ? '_' + routeInfo.path.replace('/','_') : '');

            loadMetadata(name);
        });
    });

    routes.subscribe(function (oldRoutes) {
      oldRoutes.forEach(routeOptions => {
          navigation.removeNav(routeOptions.text);
      });
  }, null, 'beforeChange');

    // TODO: make sure redundant call does not cause undesirable effects
    navigation.init(node.initial || 0);
    navigation.reRoute();

    return merge(node, {
        navLinks: navLinks,
        activeLink: activeLink,
        dispose: function () {
            routes([]);
        }
    });
}
