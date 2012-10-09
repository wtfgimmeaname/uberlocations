requirejs.config({
  shim: {
    'underscore': { exports: '_' },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'bootstrap': {
      deps: ['jquery'],
      exports: 'bootstrap'
    }
  },
  /**
   * Modified Underscore and Backbone to be AMD compatible (define themselves)
   * since it didn't work properly with the RequireJS shim when optimizing
   */
  paths: {
    'async'             : 'lib/async',
    'text'              : 'lib/text',
    'jquery'            : 'lib/jquery',
    'underscore'        : 'lib/underscore-amd',
    'backbone'          : 'lib/backbone-amd',
    'bootstrap'         : 'lib/bootstrap',
    'moment'            : 'lib/moment',
    'googlemaps'        : 'lib/google-maps',
    'Mediator'          : 'lib/mediator',
    'App'               : 'app',
    'Router'            : 'router',
    'UberLocModel'      : 'models/uberloc',
    'UberLocsCollection': 'collections/uberlocs',
    'HeaderView'        : 'views/header',
    'UberLocsListView'  : 'views/uberlocs/index',
    'UberLocsEditView'  : 'views/uberlocs/edit',
    'UberLocView'       : 'views/uberlocs/show'
  }
});

require(['App'], function(App, UberLoc) { App.initialize(); });
