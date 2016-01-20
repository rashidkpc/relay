const Score = require('../../../lib/score');
const priorityBonus = require('../../../lib/priority_bonus');
const _ = require('lodash');

module.exports = new Score ('issue_comment', {
  fn: event => {
    if (event.type !== 'IssueCommentEvent') return;

    const size = event.payload.comment.body.length;
    const bonus = priorityBonus(event);

    let points = 0;
    if (size > 10000) points = 5;
    if (size > 1000)  points = 3;
    if (size > 100)   points = 1;
    points = 0.3;
    return points + bonus;

  },
  color: '#F29E3D',
  toHTML: event => {
    return '<a target="_blank" href="' + event._source.payload.issue.html_url + '">' +
    event._source.repo.name + '#' +
    event._source.payload.issue.number + '</a>';
  }
});
