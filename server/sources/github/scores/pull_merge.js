const Score = require('../../../lib/score');
const priorityBonus = require('../../../lib/priority_bonus');
const _ = require('lodash');

module.exports = new Score ('pull_merged', {
  fn: event => {


    const isMergeEvent = _.get(event, 'payload.pull_request.merged');

    const isClosed = event.type === 'PullRequestEvent' &&
      _.get(event, 'payload.pull_request.state') === 'closed';

    if (isMergeEvent && isClosed) {
      const bonus = priorityBonus(event);
      return 0.5 + bonus; // Bonus for closing on a pull
    }

    if (isClosed) {
      return 0.1; // Closed without merge
    }

  },
  color: '#920753',
  toHTML: event => {
    const htmlUrl = _.get(event._source, 'payload.pull_request.html_url');
    const repoName = _.get(event._source, 'repo.name');
    const issueNumber = _.get(event._source, 'payload.number');

    const notMerged = !_.get(event, 'payload.pull_request.merged');
    return `<a target="_blank" href="${htmlUrl}">${repoName}#${issueNumber}</a> ${notMerged ? '<i>not merged</i>' : ''}`;
  }
});
