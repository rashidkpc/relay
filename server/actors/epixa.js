const Actor = require('../lib/actor');

module.exports = new Actor('epixa', {
  aliases: {
    hipchat: 'Court'
  },
  sources: {
    github: {
      email: 'court@epixa.com'
    }
  }
});
