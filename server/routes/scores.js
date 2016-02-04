const _ = require('lodash');
const loadMethods = require('../lib/load_methods.js');
const actorNames = _.pluck(loadMethods('../actors'), 'name');
const config = require('../lib/config');
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: config.elasticsearch.host,
});

// It would make sense to only shown known actors by default.
// Need a switch to show unknown actors
module.exports = function (server) {
  return function (request, reply) {
    const nestedAggs =  {
      nested: {
        path: 'relay_scores'
      },
      aggs: {
        types: {
          terms: {
            field: 'relay_scores.name',
            size: 10000
          },
          aggs: {
            score: {
              sum: {
                field: 'relay_scores.score'
              }
            }
          }
        },
        score: {
          sum: {
            field: 'relay_scores.score'
          }
        }
      }
    };

    client.search({
      index: config.index + '*',
      body: {
        query: {
          bool: {
            filter: {
              bool: {
                must: [
                  {
                    range: {
                      '@timestamp': {
                        gt: request.payload.time.gt,
                        lte: request.payload.time.lte
                      }
                    }
                  },
                  {
                    terms: {
                      'relay_actor': actorNames
                    }
                  }
                ]
              }
            }
          }
        },
        aggs: {
          scores_array: nestedAggs,
          actors: {
            terms: {
              field: 'relay_actor',
              size: 10000
            },
            aggs: {
              scores_array: nestedAggs
            }
          },
          timeline: {
            date_histogram: {
              field: '@timestamp',
              interval: ((request.payload.time.lte - request.payload.time.gt) / 100) + 'ms'
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

      const actors = _.chain(result.aggregations.actors.buckets)
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

      const types = getScores(result.aggregations.scores_array.types.buckets,
        result.aggregations.scores_array.score.value);

      const timeline = result.aggregations.timeline.buckets.map(bucket => {
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
    });
  };
};
