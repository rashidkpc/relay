const Score = require('../../../lib/score');
const priorityBonus = require('../../../lib/priority_bonus');
const _ = require('lodash');

module.exports = new Score ('pull_comment', {
  fn: event => {
    const isPrComment = _.get(event, 'payload.issue.pull_request.url') && event.type === 'IssueCommentEvent';
    if (isPrComment) {
      const bonus = priorityBonus(event);
      return 0.1 + bonus; // Bonus for commenting on a pull
    }
  },
  color: '#72003E',
  toHTML: event => {
    return '<a target="_blank" href="' + event._source.payload.issue.html_url + '">' +
    event._source.repo.name + '#' +
    event._source.payload.issue.number + '</a>';
  }
});
