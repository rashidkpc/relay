const Score = require('../../../lib/score');
const _ = require('lodash');

module.exports = new Score ('message', {
  fn: event => {
    return event.message.length / 1000;
  },
  color: '#666',
  toHTML: function (event) {
    return event._source.message;
  }
});
