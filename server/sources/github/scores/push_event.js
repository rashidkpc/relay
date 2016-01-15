const Score = require('../../../lib/score');
const _ = require('lodash');
const loadMethods = require('../../../lib/load_methods');
const actors = loadMethods('../actors');
const githubEmails = _.zipObject(actors.map((actor) =>
      [actor.name, _.get(actor, 'sources.github.email')]));

module.exports = new Score ('push_event', {
  fn: (event) => {
    const actorEmail = githubEmails[event.__relay_actor];
    if (_.get(event, 'type') === 'PushEvent') {
      let score = 0;
      _.each(event.payload.commits, commit => {
        if (commit.author.email === actorEmail) score += 0.25;
      })
      return score;
    }
  },
  color: '#80488C',
  toHTML: event => {
    return '<a target="_blank" href="' + event._source.repo.url + '">' +
    event._source.repo.name + '</a>';
  }
});
