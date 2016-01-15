const Score = require('../../../lib/score');
const _ = require('lodash');

module.exports = new Score ('push_event', {
  fn: (event, actor) => {
    const actorEmail = _.get(actor, 'sources.github.email');
    if (_.get(event, 'type') === 'PushEvent') {
      let score = 0;
      _.each(event.payload.commits, commit => {
        if (commit.author.email === actorEmail) score += 0.25;
      });
      return score;
    }
  },
  color: '#80488C',
  toHTML: (event, actor) => {
    return '<a target="_blank" href="' + event._source.repo.url + '">' +
    event._source.repo.name + '</a>';
  }
});
