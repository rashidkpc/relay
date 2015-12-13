const Score = require('../../../lib/score');
const _ = require('lodash');

module.exports = new Score ('issue_closed', {
  fn: event => {
    if (_.get(event, 'type') === 'IssuesEvent' && _.get(event, 'payload.action') === 'closed') {
      return 1.6;
    }
  },
  color: '#c6c',
  toHTML: event => {
    return '<a target="_blank" href="' + event._source.payload.issue.html_url + '">' +
    event._source.repo.name + '#' +
    event._source.payload.issue.number + '</a>';
  }
});
