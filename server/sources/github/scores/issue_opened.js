const Score = require('../../../lib/score');
const _ = require('lodash');

module.exports = new Score ('issue_opened', {
  fn: event => {
    if (_.get(event, 'type') === 'IssuesEvent' && _.get(event, 'payload.action') === 'opened') {
      return 2.3;
    }
  },
  color: '#D0D102',
  toHTML: event => {
    return '<a target="_blank" href="' + event._source.payload.issue.html_url + '">' +
    event._source.repo.name + '#' +
    event._source.payload.issue.number + '</a>';
  }
});
