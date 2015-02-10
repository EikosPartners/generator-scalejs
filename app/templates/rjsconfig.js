/*jshint ignore:start*/
requirejs({
  baseUrl: 'src',
  scalejs: {
    extensions: [ //TODO: FIX THIS TEMPORARY HACK, this map and extensions assume mvvm pattern
      'scalejs.mvvm',
      'scalejs.statechart-scion'
    ]
  },
  map: {
    '*': {
      sandbox: 'scalejs.sandbox',
      bindings: 'scalejs.mvvm.bindings',
      views: 'scalejs.mvvm.views'
    }
  },
  paths: {
  }
});
/*jshint ignore:end*/

