var v1       = '/api/v1',
    utils    = require('../../lib/utils'),
    _        = require('underscore'),
    NotFound = utils.NotFound,
    checkErr = utils.checkErr,
    log      = console.log,
    UberLocsController;

UberLocsController = function(app, mongoose, config) {
  var UberLoc = mongoose.model('UberLoc');

  app.get(v1 + '/uberlocs', function index(req, res, next) {
    UberLoc.find(function(err, locs) {
      checkErr( next, [{ cond: err }], function() { res.json(locs); });
    });
  });

  app.get(v1 + '/uberlocs/:id', function show(req, res, next) {
    UberLoc.findById(req.params.id, function(err, loc) {
      checkErr(
        next,
        [{ cond: err }, { cond: !loc, err: new NotFound('json') }],
        function() { res.json(loc); }
      );
    });
  });

  app.post(v1 + '/uberlocs', function create(req, res, next) {
    var newUberLoc;

    // disallow other fields besides those listed below
    newUberLoc = new UberLoc(_.pick(req.body, 'name', 'address', 'lat', 'lng'));
    newUberLoc.save(function(err) {
      var errors, code = 200, loc;

      if (!err) {
        loc = config.site_url + v1 + '/uberlocs/' + newUberLoc._id;
        res.setHeader('Location', loc);
        res.json(newUberLoc, 201);
      } else {
        errors = utils.parseDbErrors(err, config.error_messages);
        if (errors.code) {
          code = errors.code;
          delete errors.code;
          log(err); // TODO: better better logging system
        }
        res.json(errors, code);
      }
    });
  });

  app.put(v1 + '/uberlocs/:id', function update(req, res, next) {
    UberLoc.findById(req.params.id, function(err, loc) {
      checkErr(
        next,
        [{ cond: err }, { cond: !loc, err: new NotFound('json') }],
        function() {
          var newAttributes;
          newAttributes = _.pick(req.body, 'name', 'email', 'born', 'company');
          loc = _.extend(loc, newAttributes);
          loc.save(function(err) {
            var errors, code = 200;
            if (!err) { res.send(); }
            else {
              errors = utils.parseDbErrors(err, config.error_messages);
              if (errors.code) {
                code = errors.code;
                delete errors.code;
                log(err);
              }
              res.json(errors, code);
            }
          });
        }
      );
    });
  });

  app.del(v1 + '/uberlocs/:id', function destroy(req, res, next) {
    UberLoc.findById(req.params.id, function(err, loc) {
      checkErr(
        next,
        [{ cond: err }, { cond: !loc, err: new NotFound('json') }],
        function() {
          loc.remove();
          res.json({});
        }
      );
    });
  });
};

module.exports = UberLocsController;
