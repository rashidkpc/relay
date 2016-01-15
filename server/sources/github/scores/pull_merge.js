const Score = require('../../../lib/score');
const _ = require('lodash');

module.exports = new Score ('pull_merged', {
  fn: event => {

    const isMergeEvent = _.get(event, 'payload.pull_request.merged_by.url') &&
      event.type === 'PullRequestEvent' &&
      _.get(event, 'payload.pull_request.state') === 'closed';

    if (isMergeEvent) {
      return 2.5;
    }
  },
  color: '#9E16F2',
  toHTML: event => {
    return '<a target="_blank" href="' + event._source.payload.issue.html_url + '">' +
    event._source.repo.name + '#' +
    event._source.payload.issue.number + '</a>';
  }
});

