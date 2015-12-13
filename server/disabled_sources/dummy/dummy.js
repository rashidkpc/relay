const Source = require('../../lib/source.js');

module.exports = new Source('dummy', {
  timestamp: 'date',
  id: 'eyedee',
  actor: 'user',
  start: function (server) {
    this.store({
      date: (new Date()).toISOString(),
      eyedee: Math.floor(Math.random() * 100000000000),
      user: 'gorilla',
      foo: 'lol scoring up in here',
      bar: 235829734
    });
  }
});