const Actor = require('../lib/actor');

module.exports = new Actor('w33ble', {
  aliases: {
    discourse: 'Joe_Fleming'
  },
  sources: {
    github: {
      email: 'joe.fleming@gmail.com',
      repos: ['kibana', 'x-plugins']

    }
  }
});
