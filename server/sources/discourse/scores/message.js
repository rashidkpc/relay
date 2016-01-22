const Score = require('../../../lib/score');
const _ = require('lodash');

module.exports = new Score ('post', {
  fn: event => {
    return event.excerpt.length / 500;
  },
  color: '#1D9A91',
  toHTML: function (event) {
    return `<a href="http://discuss.elastic.co/t/${event._source.topic_id}/${event._source.post_number}">
            discuss#${event._source.post_id}</a>: ${event._source.title}"`;
  }
});
