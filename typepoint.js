
var stream = require('stream');
var util = require('util');

function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

function newDate(value) {
  return new Date(value);
}

function Typepoint(rules) {
  if (!(this instanceof Typepoint)) return new Typepoint(rules);

  stream.Transform.call(this, {
    objectMode: true
  });

  if (!isObject(rules)) {
    throw new TypeError('rules must be an object or array');
  }

  this._rules = rules;
  this._funcKeys = [];
  this._constKeys = [];

  Object.keys(rules).forEach(function (key) {
    var rule = this._rules[key];

    if (typeof rule !== 'function') {
      this._constKeys.push(key);
    } else {
      this._funcKeys.push(key);

      // Date is special
      if (rule === Date) this._rules[key] = newDate;
    }
  }, this);
}
util.inherits(Typepoint, stream.Transform);
module.exports = Typepoint;

Typepoint.prototype._transform = function (object, encoding, done) {
  var i, l, key;

  for (i = 0, l = this._funcKeys.length; i < l; i++) {
    key = this._funcKeys[i];
    object[key] = this._rules[key](object[key]);
  }

  for (i = 0, l = this._constKeys.length; i < l; i++) {
    key = this._constKeys[i];
    object[key] = this._rules[key];
  }

  this.push(object);
  done(null);
};

Typepoint.prototype._flush = function (done) {
  this.push(null);
  done(null);
};
