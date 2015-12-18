const Score = require('../../../lib/score');
const _ = require('lodash');

module.exports = new Score ('pull_comment', {
  fn: event => {
    if (_.get(event, 'payload.issue.pull_request.url') && event.type === 'IssueCommentEvent') {
      return 0.5; // Bonus for commenting on a pull
    }
  },
  color: '#F2CE16',
  toHTML: event => {
    return '<a target="_blank" href="' + event._source.payload.issue.html_url + '">' +
    event._source.repo.name + '#' +
    event._source.payload.issue.number + '</a>';
  }
});
