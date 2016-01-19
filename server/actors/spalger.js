const Actor = require('../lib/actor');

module.exports = new Actor('spalger', {
  aliases: {
  },
  sources: {
    github: {
      email: 'spalger@users.noreply.github.com',
      repos: ['kibana', 'x-plugins']
    }
  }
});
