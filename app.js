var application_root = __dirname,
    express          = require('express'),
    path             = require('path'),
    mongoose         = require('mongoose');

var app = express();

// Database
mongoose.connect('mongodb://localhost/uber_database');

// Config
app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/api', function(req, res) { res.send('Uber API is running'); });

// Launch server
app.listen(4242);

// Load in Model Schema
var Schema  = mongoose.Schema;
var UberLoc = new Schema({
  lat: { type: Number },
  lng: { type: Number},
  address: { type: String },
  name: { type: String }
});

var UberLocModel = mongoose.model('UberLoc', UberLoc);

// Controller methods
// READ a list of locations
app.get('/api/uberlocs', function(req, res) {
  return UberLocModel.find(function (err, locs) {
    if (!err) { res.send(locs); }
    else { return console.log(err); }
  });
});

// CREATE a location
app.post('/api/uberlocs', function(req, res) {
  console.log("POST: ");
  console.log(req.body);
  var loc = new UberLocModel({
    name: req.body.name,
    address: req.body.address,
    lat: req.body.lat,
    lng: req.body.lng
  });
  loc.save(function (err) {
    if (!err) { return console.log('created'); }
    else { return console.log(err); }
  });
});

// READ a single location
app.get('/api/uberlocs/:id', function(req, res) {
  return UberLocModel.findById(req.params.id, function(err, loc) {
    if (!err) { return res.send(loc); }
    else { return console.log(err); }
  });
});

// UPDATE a location by ID
app.put('/api/uberlocs/:id', function(req, res) {
  return UberLocModel.findById(req.params.id, function(err, loc) {
    loc.name = req.body.name;
    loc.address = req.body.address;
    loc.lat = req.body.lat;
    loc.lng = req.body.lng;
    return loc.save(function(err) {
      if (!err) { console.log("updated"); }
      else { console.log(err); }
      return res.send(loc);
    });
  });
});

// DELETE a location by ID
app.delete('/api/uberlocs/:id', function(req, res) {
  return UberLocModel.findById(req.params.id, function(err, loc) {
    return loc.remove(function(err) {
      if (!err) {
        console.log('reoved');
        return res.send('');
      } else { console.log(err) }
    });
  });
});
