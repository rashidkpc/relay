const Actor = require('../lib/actor');

module.exports = new Actor('Kreeware', {
  aliases: {},
  sources: {
    github: {
      email: 'not.a.real.actor@not.a.real.actor',
      repos: ['grunt-esvm', 'es-vagrant', 'makelogs']
    }
  }
});
