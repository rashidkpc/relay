const Actor = require('../lib/actor');

module.exports = new Actor('epixa', {
  aliases: {
    hipchat: 'Court',
    irc: 'court',
    discourse: 'Court'
  },
  sources: {
    github: {
      email: 'court@epixa.com',
      repos: ['kibana', 'x-plugins']
    }
  }
});
