const Score = require('../../../lib/score');
const _ = require('lodash');

module.exports = new Score ('issue_comment', {
  fn: event => {
    if (_.get(event, 'payload.issue.pull_request.url') == null && event.type === 'IssueCommentEvent') {
      return 1;
    }
  },
  color: '#c66',
  toHTML: event => {
    return '<a target="_blank" href="' + event._source.payload.issue.html_url + '">' +
    event._source.repo.name + '#' +
    event._source.payload.issue.number + '</a>';
  }
});
