/* dummy */     
(function () {
  'use strict';

  require.config({
    shim: {
      'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      },
      'underscore': {
        exports: '_'
      }
    },
    paths: {
      "jquery": "../bower_components/jquery/jquery",
      "underscore": "../bower_components/underscore/underscore",
      "backbone": "../bower_components/backbone/backbone"
    }
  });
  require(['app/router'], function (Router) {
    new Router();
  });
})();
