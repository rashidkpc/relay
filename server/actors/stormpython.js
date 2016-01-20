const Actor = require('../lib/actor');

module.exports = new Actor('stormpython', {
  aliases: {
    hipchat: 'shelby',
    discourse: 'stormpython'
  },
  sources: {
    github: {
      email: 'shelbyjsturgis@gmail.com',
      repos: ['kibana', 'x-plugins']
    }
  }
});
