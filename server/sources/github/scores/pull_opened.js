const Score = require('../../../lib/score');
const _ = require('lodash');

module.exports = new Score ('pull_merged', {
  fn: event => {

    const isAMatch = event.type === 'PullRequestEvent' &&
      _.get(event, 'payload.pull_request.state') === 'open';

    if (isAMatch) {
      return 0.5; // Bonus for opening a pull
    }
  },
  color: '#E716F2',
  toHTML: event => {
    return 'PR Opened: <a target="_blank" href="' + event._source.payload.issue.html_url + '">' +
    event._source.repo.name + '#' +
    event._source.payload.issue.number + '</a>';
  }
});


