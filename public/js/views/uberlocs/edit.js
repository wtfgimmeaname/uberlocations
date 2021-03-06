define('UberLocsEditView', [
  'jquery',
  'underscore',
  'backbone',
  'moment',
  'googlemaps',
  'text!templates/uberlocs/edit.html',
  'UberLocModel'
], function($, _, Backbone, moment, google, tpl, UberLoc) {
  var UberLocsEditView;

  UberLocsEditView = Backbone.View.extend({
    initialize: function() { this.template = _.template(tpl); },

    events: {
      "focus input"       : "removeErrMsg",
      "click .save-btn"   : "saveUberLoc",
      "click .back-btn"   : "goBack",
      "click .delete-btn" : "deleteUberLoc"
    },

    render: function() {
      var tmpl, title;
      title = (this.model.isNew()) ? "New Location" : "Edit Location";

      tmpl = this.template({ loc: this.model.toJSON(), title: title });
      $(this.el).html(tmpl);
      return this;
    },

    goBack: function(e) {
      e.preventDefault();
      this.trigger('back');
    },

    saveUberLoc: function(e) {
      var name, address, that;
      e.preventDefault();

      this.removeErrMsg();

      that    = this;
      name    = $.trim($('#name-input').val());
      address = $.trim($('#address-input').val());

      // Build coordinates
      this.model.set({ name: name, address: address }, { silent: true });
      if (this.model.isValid()) { google.getCoordinates(address, this); }
      else {
        var tst = this.model.validate({ name: name, address: address });
        this.renderErrMsg(tst.errors);
      }
    },

    coordsCallback: function(lat, lng) {
      var that = this;

      that.model.save({
        lat: parseFloat(lat.toFixed(3)),
        lng: parseFloat(lng.toFixed(3))
      }, {
        silent  : false,
        sync    : true,
        success : function(model, res) {
          if (res && res.errors) { that.renderErrMsg(res.errors); }
          else { that.model.trigger('save-success', model.get('_id')); }
        },
        error: function(model, res) {
          if (res && res.errors) { that.renderErrMsg(res.errors); }
          else if (res.status === 404) {} // TODO: handle 404 Not Found
          else if (res.status === 500) {} // TODO: handle 500 Internal Server Error
        }
      });
    },

    deleteUberLoc: function(e) {
      e.preventDefault();

      this.model.destroy({
        success : function(model, res) {
          if (res && res.errors) { that.renderErrMsg(res.errors); }
          else { model.trigger('delete-success'); }
        },
        error: function(model, res) {
          if (res && res.errors) { that.renderErrMsg(res.errors); }
          else if (res.status === 404) {} // TODO: handle 404 Not Found
          else if (res.status === 500) {} // TODO: handle 500 Internal Server Error
        }
      });
    },

    renderErrMsg: function(err) {
      var that = this;
      _.each(err, function(e, idx) {
        $(that.el).find('#'+idx+"-input").closest('.control-group')
                  .addClass('error');
      });
    },

    removeErrMsg: function() { $(this.el).find('.error').removeClass('error'); }
  });

  return UberLocsEditView;
});
