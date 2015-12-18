const Score = require('../../../lib/score');
const _ = require('lodash');

module.exports = new Score ('issue_comment', {
  fn: event => {
    if (event.type !== 'IssueCommentEvent') return;

    const size = event.payload.comment.body.length;

    if (size > 10000) return 5;
    if (size > 1000)  return 3;
    if (size > 100)   return 1;
    return 0.3;

  },
  color: '#c66',
  toHTML: event => {
    return '<a target="_blank" href="' + event._source.payload.issue.html_url + '">' +
    event._source.repo.name + '#' +
    event._source.payload.issue.number + '</a>';
  }
});
