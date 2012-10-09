module.exports = function(mongoose) {
  var validator = require('../../lib/validator'),
      Schema    = mongoose.Schema,
      UberLoc;

  UberLoc = new Schema({
    lat    : { type: Number },
    lng    : { type: Number },
    address: { type: String },
    name   : { type: String }
  });

  function like(query, field, val) {
    return (field) ? query.regex(field, new RegExp(val, 'i')) : query;
  }

  UberLoc.statics.search = function search(params, callback) {
    var Model = mongoose.model('UberLoc'),
        query = Model.find();

    like(query, 'name', params.name);
    like(query, 'address', params.address);

    query.exec(callback);
  };

  UberLoc.statics.findById = function findById(id, callback) {
    var Model = mongoose.model('UberLoc'),
        query = Model.find();

    if (id.length !== 24) { callback(null, null); }
    else { Model.findOne().where('_id', id).exec(callback); }
  };

  return mongoose.model('UberLoc', UberLoc);
}
