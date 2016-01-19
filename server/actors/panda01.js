const Actor = require('../lib/actor');

module.exports = new Actor('panda01', {
  aliases: {
    hipchat: 'Khalah'
  },
  sources: {
    github: {
      email: 'khasan222@gmail.com',
      repos: ['kibana']
    }
  }
});
