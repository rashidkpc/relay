const Actor = require('../lib/actor');

module.exports = new Actor('BigFunger', {
  aliases: {
    hipchat: 'Jim'
  },
  sources: {
    github: {
      email: 'BigFunger@gmail.com',
      repos: ['kibana']
    }
  }
});
