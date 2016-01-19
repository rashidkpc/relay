const Score = require('../../../lib/score');
const priorityBonus = require('../../../lib/priority_bonus');
const _ = require('lodash');

module.exports = new Score ('pull_opened', {
  fn: event => {

    const isAMatch = event.type === 'PullRequestEvent' &&
      _.get(event, 'payload.pull_request.state') === 'open';

    if (isAMatch) {
      const bonus = priorityBonus(event);
      return 0.5 + bonus; // Bonus for opening a pull
    }
  },
  color: '#E716F2',
  toHTML: event => {
    const htmlUrl = _.get(event._source, 'payload.pull_request.html_url');
    const repoName = _.get(event._source, 'repo.name');
    const issueNumber = _.get(event._source, 'payload.number');
    return `<a target="_blank" href="${htmlUrl}">${repoName}#${issueNumber}</a>`;
  }
});


