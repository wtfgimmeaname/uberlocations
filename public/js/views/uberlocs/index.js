define('UberLocsListView', [
  'jquery',
  'underscore',
  'backbone',
  'googlemaps',
  'moment',
  'text!templates/uberlocs/index.html',
  'UberLocsCollection'
], function($, _, Backbone, google, moment, tpl, UberLocsCollection) {
  var UberLocsListView;

  UberLocsListView = Backbone.View.extend({
    initialize: function() {
      var uberLocsList;

      this.template = _.template(tpl);
      this.collection = new UberLocsCollection();
    },

    getData: function(callback) {
      this.collection.fetch({
        success: function(collection) { callback(collection); },
        error: function(coll, res) {
          if (res.status === 404) {} // TODO: handle 404 Not Found
          else if (res.status === 500) {} // TODO: handle 500 Internal Server Error
        }
      });
    },

    render: function(callback) {
      var that = this, tmpl;

      this.getData(function(collection) {
        tmpl = that.template({ uberLocs: collection.toJSON() });
        $(that.el).html(tmpl);

        _.each(collection.models, function(model) {
          ele = $(that.el).find('#'+model.get('_id'))[0];
          google.renderMap(model, ele, 12);
        });

        callback();
      });
    }
  });

  return UberLocsListView;
});
