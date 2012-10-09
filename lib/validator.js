var moment = require('moment'),
    _      = require('underscore');

module.exports = function(opts) {
  return function(val) {
    if (!val) { return false; }
    if (opts.length && opts.length.min && opts.length.min !== 0 && opts.length.max) {
      if (val.length < opts.length.min || val.length > opts.length.max) { return false; }
    }

    return true;
  };
};
