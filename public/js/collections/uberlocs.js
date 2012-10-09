define('UberLocsCollection', [
  'jquery',
  'underscore',
  'backbone',
  'UberLocModel'
], function($, _, Backbone, UberLoc) {
  var UberLocsCollection;

  UberLocsCollection = Backbone.Collection.extend({
    model : UberLoc,
    url   : "api/v1/uberlocs"
  });

  return UberLocsCollection;
});
