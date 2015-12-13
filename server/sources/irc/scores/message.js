const Score = require('../../../lib/score');
const _ = require('lodash');

module.exports = new Score ('message', {
  fn: event => {
    return event.message.length / 100;
  },
  color: '#6cc',
  toHTML: function (event) {
    return event._source.message;
  }
});
