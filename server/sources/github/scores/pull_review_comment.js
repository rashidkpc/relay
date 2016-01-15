const Score = require('../../../lib/score');
const _ = require('lodash');

module.exports = new Score ('pull_review_comment', {
  fn: event => {
    const isPrComment = event.type === 'PullRequestReviewCommentEvent';
    if (isPrComment) {
      return 0.75; // Bonus for commenting on a pull
    }
  },
  color: '#DB9704',
  toHTML: event => {
    return '<a target="_blank" href="' + event._source.payload.pull_request.html_url + '">' +
    event._source.repo.name + '#' +
    event._source.payload.pull_request.number + '</a>';
  }
});
