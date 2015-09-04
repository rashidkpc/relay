var ImpactBlock = require('../lib/impact_block');

module.exports = new ImpactBlock ('Push', {
  fn: {
    filter: {
      term: {
        type: 'pushevent',
      }
    },
    weight: 1.6
  },
  color: '#FFD34E'
});
