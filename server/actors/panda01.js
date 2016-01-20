const Actor = require('../lib/actor');

module.exports = new Actor('panda01', {
  aliases: {
    hipchat: 'Khalah',
    discourse: 'Khalah_Jones_Golden'
  },
  sources: {
    github: {
      email: 'khasan222@gmail.com',
      repos: ['kibana', 'x-plugins']
    }
  }
});
