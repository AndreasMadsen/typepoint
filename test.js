
var endpoint = require('endpoint');
var startpoint = require('startpoint');
var typepoint = require('./typepoint.js');
var test = require('tap').test;

test('typepoint throws on no argument', function (t) {
  try {
    typepoint();
  } catch (e) {
    t.equal(e.name, 'TypeError');
    t.equal(e.message, 'rules must be an object or array');
    t.end();
  }
});

test('typepoint converts objects', function (t) {
  var values = [
    {id: '1', time: 0, other: undefined, check: true},
    {id: '2', time: 0, other: 'hi'}
  ];

  startpoint(values, {objectMode: true})
    .pipe(typepoint({id: Number, time: Date, check: Boolean}))
    .pipe(endpoint({objectMode: true}, function (err, rows) {
      t.equal(err, null);
      t.deepEqual(rows, [
        {id: 1, time: new Date(0), other: undefined, check: true},
        {id: 2, time: new Date(0), other: 'hi', check: false}
      ]);
      t.end();
    }));
});


test('typepoint converts arrays', function (t) {
  var values = [
    ['1', 0, true],
    ['2', 0]
  ];

  startpoint(values, {objectMode: true})
    .pipe(typepoint([Number, Date, Boolean]))
    .pipe(endpoint({objectMode: true}, function (err, rows) {
      t.equal(err, null);
      t.deepEqual(rows, [
        [1, new Date(0), true],
        [2, new Date(0), false]
      ]);
      t.end();
    }));
});
