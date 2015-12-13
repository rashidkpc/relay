const Score = require('../../../lib/score');
const _ = require('lodash');

module.exports = new Score ('foo', {
  fn: event => {
    return Promise.resolve(event.foo.length);
  },
  color: '#616161',
  toHTML: event => {
    return '<a target="_blank" href="' + event._source.payload.issue.html_url + '">' +
    event._source.repo.name + '#' +
    event._source.payload.issue.number + '</a>';
  }
});
