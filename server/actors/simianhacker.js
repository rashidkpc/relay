const Actor = require('../lib/actor');

module.exports = new Actor('simianhacker', {
  aliases: {
  },
  sources: {
    github: {
      email: 'chris@chriscowan.us',
      repos: ['kibana', 'esvm', 'libesvm', 'x-plugins']
    }
  }
});
