var _ = require('lodash');
var loadMethods = require('../lib/load_methods.js');
var config = require('../../relay.json');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: config.elasticsearch.host,
});

module.exports = function (server) {
  return function (request, reply) {
    var nestedAggs =  {
      nested: {
        path: '__relay_scores'
      },
      aggs: {
        types: {
          terms: {
            field: '__relay_scores.name',
            size: 10000
          },
          aggs: {
            score: {
              sum: {
                field: '__relay_scores.score'
              }
            }
          }
        },
        score: {
          sum: {
            field: '__relay_scores.score'
          }
        }
      }
    };

    client.search({
      index: config.index + '*',
      body: {
        aggs: {
          scores_array: nestedAggs,
          actors: {
            terms: {
              field: '__relay_actor',
              size: 10000
            },
            aggs: {
              scores_array: nestedAggs
            }
          },
          timeline: {
            date_histogram: {
              field: '@timestamp',
              interval: '10m'
            },
            aggs: {
              scores_array: nestedAggs
            }
          }
        },
        size: 10,
        sort: [{ '@timestamp' : {order : 'desc'}}]
      }
    }).then(result => {

      function getScores(buckets, baseScore) {
        return buckets.map(type => {
          return {
            name: type.key,
            count: type.doc_count,
            score: type.score.value,
            percent: type.score.value / baseScore
          };
        });
      }

      var actors = _.chain(result.aggregations.actors.buckets)
        .map(actor => {
          return {
            name: actor.key,
            score: actor.scores_array.score.value,
            count: actor.doc_count,
            percent: actor.scores_array.score.value / result.aggregations.scores_array.score.value,
            types: getScores(actor.scores_array.types.buckets, actor.scores_array.score.value)
          };
        })
        .sortBy('score')
        .reverse()
        .value();

      var types = getScores(result.aggregations.scores_array.types.buckets,
        result.aggregations.scores_array.score.value);

      var timeline = result.aggregations.timeline.buckets.map(bucket => {
        return [bucket.key, bucket.scores_array.score.value];
      });

      reply({
        result: result,
        types: types,
        score: result.aggregations.scores_array.score.value,
        actors: actors,
        timeline: timeline,
        events: result.hits
      });

      //reply(result);

    });
  };
};
