const Score = require('../../../lib/score');
const priorityBonus = require('../../../lib/priority_bonus');
const _ = require('lodash');

module.exports = new Score ('issue_closed', {
  fn: event => {
    if (_.get(event, 'type') === 'IssuesEvent' && _.get(event, 'payload.action') === 'closed') {
      const bonus = priorityBonus(event);
      return 1.6 + bonus;
    }
  },
  color: '#00A1CB',
  toHTML: event => {
    return '<a target="_blank" href="' + event._source.payload.issue.html_url + '">' +
    event._source.repo.name + '#' +
    event._source.payload.issue.number + '</a>';
  }
});
