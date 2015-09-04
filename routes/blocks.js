var loadScoreFilters = require('../lib/load_score_filters.js');

module.exports = function (request, reply) {
  reply(loadScoreFilters());
};