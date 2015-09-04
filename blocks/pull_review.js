var ImpactBlock = require('../lib/impact_block');

module.exports = new ImpactBlock ('Pull Review', {
  fn: {
    filter: {
      term: {
        type: 'pullrequestreviewcommentevent'
      }
    },
    weight: 1.8
  },
  color: '#c66'
});
