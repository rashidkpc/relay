const Actor = require('../lib/actor');

module.exports = new Actor('Bargs', {
  aliases: {
    hipchat: 'Matt'
  },
  sources: {
    github: {
      email: 'mbargar@gmail.com',
      repos: ['kibana']
    }
  }
});
