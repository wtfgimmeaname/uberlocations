define('UberLocView', [
  'jquery',
  'underscore',
  'backbone',
  'moment',
  'googlemaps',
  'text!templates/uberlocs/show.html',
  'UberLocModel'
], function($, _, Backbone, moment, google, tpl, UberLocModel) {
  var UberLocView;

  UberLocView = Backbone.View.extend({
    initialize: function() {
      this.template = _.template(tpl);
    },

    render: function() {
      var that = this, tmpl;

      $(this.el).html(this.template({ loc: this.model.toJSON() }));
      google.renderMap(this.model, $(this.el).find('#google-map')[0]);

      return this;
    },
  });

  return UberLocView;
});
