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
  color: '#F26252',
  importance: 10,
  toHTML: function (event) {
    return '<a target="_blank" href="' + event._source.payload.pull_request.html_url + '">' +
    event._source.repo.name + '#' +
    event._source.payload.pull_request.number + '</a>';
  }
});
