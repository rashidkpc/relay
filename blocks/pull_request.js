var ImpactBlock = require('../lib/impact_block');

module.exports = new ImpactBlock ('Pull Request', {
  fn: {
    filter: {
      term: {
        type: 'pullrequestevent',
      }
    },
    weight: 2
  },
  color: '#F26252'
});
