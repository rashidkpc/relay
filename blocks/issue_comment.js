var ImpactBlock = require('../lib/impact_block');

module.exports = new ImpactBlock ('Issue Comment', {
  fn: {
    filter: {
      term: {
        type: 'issuecommentevent',
      }
    },
    weight: 0.5
  },
  color: '#01A4A4'
});
