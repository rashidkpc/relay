const Score = require('../../../lib/score');
const _ = require('lodash');
const scorePerCommit = 0.25;

module.exports = new Score ('push_event', {
  fn: (event, actor) => {
    const actorEmail = _.get(actor, 'sources.github.email');
    if (_.get(event, 'type') === 'PushEvent') {
      let score = 0;
      _.each(event.payload.commits, commit => {
        if (commit.author.email === actorEmail) score += scorePerCommit;
      });
      return score;
    }
  },
  color: '#80488C',
  toHTML: (event, actor) => {
    const sha = _.get(event._source, 'payload.head');
    const repoName = _.get(event._source, 'repo.name');
    return `Pushed ${event._source.relay_total_score / scorePerCommit} commits to <a href="https://github.com/${repoName}/commit/${sha}">${repoName}</a>`;
  }
});
