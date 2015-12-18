const Score = require('../../../lib/score');
const _ = require('lodash');

module.exports = new Score ('message', {
  fn: event => {
    return event.message.length / 1000;
  },
  color: '#01A4A4',
  toHTML: function (event) {
    return event._source.message;
  }
});
