var _ = require('lodash');
var loadMethods = require('../lib/load_methods.js');
var config = require('../relay.json');
/*
  Knobs contain:
  query:  wrapped in a constant score and used as query key of a function_score query
  basis: the "boost" parameter of the constant score
  functions: array of function_score functions for mutating the basis.
    score_mode: sum
    boost_mode: multiply.

  So to reduce the score from the basis, return a sum of all functions that is < 1, to increase, > 1
*/

var blocks = loadMethods('blocks');

function createBody() {
  var filters = _.map(blocks, function (block) {
    return block.fn.filter;
  });

  var functions = _.map(blocks, function (block) {
    return block.fn;
  });

  var filtersAgg = _.zipObject(_.map(blocks, function (block) {
    return [block.name, block.fn.filter];
  }));

  return {
    query: {
      bool: {
        must: [
          {
            function_score: {
              filter: {
                bool: {
                  should: filters
                }
              },
              functions: functions,
              score_mode: 'sum',
              boost_mode: 'replace'
            }
          },
          {
            constant_score: {
              filter: {
                range: {
                  _timestamp: {
                    gt: 'now-1d',
                    lte: 'now'
                  }
                }
              },
              boost: 0
            }
          }
        ]
      }
    },
    aggs: {
      blocks: {
        filters: {
          filters: filtersAgg
        },
        aggs: {
          block_score: {
            sum: {
              script: '_score',
              lang: 'expression'
            }
          }
        }
      },
      timeline: {
        date_histogram: {
          field: '_timestamp',
          interval: config.chart_interval,
          min_doc_count: 0,
          extended_bounds: {
            min: 'now-1d',
            max: 'now'
          }
        },
        aggs: {
          score: {
            sum: {
              script: '_score',
              lang: 'expression'
            }
          }
        }
      },
      score: {
        sum: {
          script: '_score',
          lang: 'expression'
        }
      },
      actors: {
        terms: {
          field: 'actor.login',
          order: {actor_score: 'desc'},
          size: 1000
        },
        aggs: {
          blocks: {
            filters: {
              filters: filtersAgg
            },
            aggs: {
              block_score: {
                sum: {
                  script: '_score',
                  lang: 'expression'
                }
              }
            }
          },
          actor_score: {
            sum: {
              script: '_score',
              lang: 'expression'
            }
          }
        }
      }
    },
    explain:true,
    size:10,
    sort: [
      {_timestamp: {order: 'desc'}},
      {_score: {order: 'desc'}}
    ]
  };
}

module.exports = function (server) {
  return function (request, reply) {

    server.plugins.elasticsearch.client.search({
      index: '.gitboard_events',
      body: createBody(),
    }).then(function (result) {
      console.log(result);
      var impact = _.map(result.aggregations.actors.buckets, function (actor) {
        return {
          name: actor.key,
          impact: actor.actor_score.value,
          count: actor.doc_count,
          impact_percent: actor.actor_score.value / result.aggregations.score.value,
          explanation: {
            blocks: _.map(actor.blocks.buckets, function (block, blockName) {
              return {
                name: blockName,
                count: block.doc_count,
                impact: block.block_score.value,
                impact_percent: block.block_score.value / actor.actor_score.value
              };
            })
          }
        };
      });

      var runningScore = 0;
      var timeline = _.map(result.aggregations.timeline.buckets, function (bucket) {
        return [bucket.key, bucket.score.value];
      });

      var blocks = _.map(result.aggregations.blocks.buckets, function (block, blockName) {
        return {
          name: blockName,
          count: block.doc_count,
          impact: block.block_score.value,
          impact_percent: block.block_score.value / config.goal
        };
      });

      reply({
        body: createBody(),
        blocks: blocks,
        impact: result.aggregations.score.value,
        actors: impact,
        timeline: timeline,
        events: result.hits
      });

    });

  };

}