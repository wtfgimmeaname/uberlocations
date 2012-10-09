define('UberLocModel', [
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {
  var UberLocModel;

  UberLocModel = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: "/api/v1/uberlocs",

    // set defaults for checking existance in the template for the new model
    defaults: {
      name    : '',
      address : '',
      lat     :  0,
      lng     :  0
    },

    validate: function(attrs) {
      var fields, i, len, nameLen, compLen, errors = {};

      /**
       * Don't validate when silent is passed as an attribute
       * Useful when fetching model from server only by id
       */
      if (!attrs._silent) {
        // check required fields
        fields = ['name', 'address'];
        for (i = 0, len = fields.length; i < len; i++) {
          if (!attrs[fields[i]]) { errors[fields[i]] = fields[i] + ' required'; }
        }

        // check valid name
        nameLen = (attrs.name) ? attrs.name.length : null;
        if (nameLen < 2 || nameLen > 100) { errors.name = "invalid name"; }
        if (_.keys(errors).length) { return { errors: errors }; }
      }

    }
  });

  return UberLocModel;
});
