define('Router', [
  'jquery',
  'underscore',
  'backbone',
  'HeaderView',
  'UberLocsListView',
  'UberLocView',
  'UberLocsEditView',
  'UberLocModel'
], function($, _, Backbone, HeaderView, UberLocsListView, UberLocView, UberLocsEditView, UberLoc) {
  var AppRouter, initialize;

  AppRouter = Backbone.Router.extend({
    routes: {
      ''                  : 'showUberLocs',
      'uberlocs'          : 'showUberLocs',
      'uberlocs/new'      : 'addUberLocs',
      'uberloc/:id'       : 'showUberLoc',
      'uberlocs/:id/edit' : 'editUberLocs',
      '*actions'          : 'defaultAction'
    },

    initialize: function() {
      this.uberLocView      = {};
      this.uberLocsView     = {};
      this.uberLocsEditView = {};
      this.headerView = new HeaderView();

      // cached elements
      this.elms = { 'page-content': $('.page-content') };
      $('header').hide().html(this.headerView.render().el).fadeIn('slow');
      $('footer').fadeIn('slow');
    },

    showUberLocs: function() {
      var that = this;
      this.headerView.select('list-menu');
      if (!this.uberLocsListView) { this.uberLocsListView = new UberLocsListView(); }
      this.uberLocsListView.render(function() {
        that.elms['page-content'].html(that.uberLocsListView.el);
      });
    },

    showUberLoc: function(id) {
      var that = this, view;

      this.headerView.select();

      // pass _silent to bypass validation to be able to fetch the model
      model = new UberLoc({ _id: id, _silent: true });
      model.fetch({
        success : function(model) {
          model.unset('_silent');

          view = new UberLocView({ model: model });
          that.elms['page-content'].html(view.render().el);
        },
        error : function(model, res) {
          if (res.status === 404) {} // TODO: handle 404 Not Found
          else if (res.status === 500) {} // TODO: handle 500 Internal Server Error
        }
      });
    },

    addUberLocs: function() {
      var that = this, model, view;
      this.headerView.select('new-menu');

      model = new UberLoc();
      view  = new UberLocsEditView({ model: model });

      this.elms['page-content'].html(view.render().el);
      view.on('back', function() {
        delete view;
        that.navigate('#/uberlocs', { trigger: true });
      });
      view.model.on('save-success', function(id) {
        delete view;
        that.navigate('#/uberlocs/' + id, { trigger: true });
      });
    },

    editUberLocs: function(id) {
      var that = this, model, view;

      this.headerView.select();

      // pass _silent to bypass validation to be able to fetch the model
      model = new UberLoc({ _id: id, _silent: true });
      model.fetch({
        success : function(model) {
          model.unset('_silent');

          // Create & render view only after model has been fetched
          view = new UberLocsEditView({ model: model });
          that.elms['page-content'].html(view.render().el);
          view.on('back', function() {
            console.log('going back');
            delete view;
            that.navigate('#/uberlocs/' + id, { trigger: true });
          });
          view.model.on('save-success', function() {
            console.log('save sucess');
            delete view;
            that.navigate('#/uberlocs/' + id, { trigger: true });
          });
          view.model.on('delete-success', function() {
            console.log('delete success');
            delete view;
            that.navigate('uberlocs', { trigger: true });
          });
        },
        error   : function(model, res) {
          if (res.status === 404) {
            // TODO: handle 404 Not Found
          } else if (res.status === 500) {
            // TODO: handle 500 Internal Server Error
          }
        }
      });

    },

    defaultAction: function(actions) {
      // No matching route, log the route?
    }
  });

  return AppRouter;
});
