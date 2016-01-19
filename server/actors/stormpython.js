const Actor = require('../lib/actor');

module.exports = new Actor('stormpython', {
  aliases: {
    hipchat: 'shelby'
  },
  sources: {
    github: {
      email: 'shelbyjsturgis@gmail.com',
      repos: ['kibana']
    }
  }
});
