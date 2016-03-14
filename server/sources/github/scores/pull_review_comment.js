const Score = require('../../../lib/score');
const priorityBonus = require('../../../lib/priority_bonus');
const _ = require('lodash');

module.exports = new Score ('pull_review_comment', {
  fn: event => {
    const isPrComment = event.type === 'PullRequestReviewCommentEvent';
    if (isPrComment) {
      const bonus = priorityBonus(event);
      return 0.2 + bonus; // Bonus for commenting on code in a pull
    }
  },
  color: '#D74193',
  toHTML: event => {
    return '<a target="_blank" href="' + event._source.payload.pull_request.html_url + '">' +
    event._source.repo.name + '#' +
    event._source.payload.pull_request.number + '</a>';
  }
});
