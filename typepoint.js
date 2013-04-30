
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
  this._keys = Object.keys(rules);

  // Date is special
  for (var i = 0, l = this._keys.length; i < l; i++) {
    if (this._rules[this._keys[i]] === Date) {
      this._rules[this._keys[i]] = newDate; 
    }
  }
}
util.inherits(Typepoint, stream.Transform);
module.exports = Typepoint;

Typepoint.prototype._transform = function (object, encoding, done) {
  for (var i = 0, l = this._keys.length; i < l; i++) {
    var key = this._keys[i];
    object[key] = this._rules[key](object[key]);
  }

  this.push(object);
  done(null);
};

Typepoint.prototype._flush = function (done) {
  this.push(null);
  done(null);
};
