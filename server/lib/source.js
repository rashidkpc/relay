const _ = require('lodash');
const config = require('./config');
const loadMethods = require('./load_methods.js');
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: config.elasticsearch.host,
});
const actors = loadMethods('../actors');

module.exports = class Source {
  constructor(type, config) {

    const actorMap = _.zipObject(actors.map((actor) =>
      [actor.aliases[type] || actor.name , actor.name]));

    const scoreFns = loadMethods('../sources/' + type + '/scores');

    /* TODO: this.template for elasticsearch templates specific to this type */
    this.type = type;
    this.start = config.start;

    this.store = event => {

      const index = 'relay_' + this.type;
      const id = _.get(event, config.id);
      const extractedActor = _.get(event, config.actor);
      const extractedTimestamp = _.get(event, config.timestamp);

      event['@timestamp'] = extractedTimestamp || (new Date()).toISOString();
      event.__relay_actor = actorMap[extractedActor] || extractedActor;
      event.__relay_known = actorMap[extractedActor] ? true : false;


      if (!index || id == null || event.__relay_actor == null) {
        console.log('Invalid event', index, id, event);
        return;
      }

      const scorePromises =

      Promise
      .all(scoreFns.map(score => score.fn(event)))
      .then(scores => {
        event.__relay_total_score = 0;
        event.__relay_scores = _.compact(scores.map((score, i) => {
          if (score == null) return null;
          event.__relay_total_score += score;
          return {name: this.type + ':' + scoreFns[i].name, source: this.type, score: score};
        }));


        client.index({
          index: index,
          type: 'relay_event',
          id: id,
          body: event
        });
      });

      /*
        event._index
          - 'relay_' + this.type
        event._id
          - from this.idPath
        Each type gets its own index.
        event.__relay_actor
          - from this.actorPath
          - Should be normalize for cross-index search
        event.__relay_scores
          - [] by default
          - {name: 'issueComment', score: 0.33}

        When to score & write an event:
          Phase 1:
          - Has: id, actor and index
          - Does not exist, need to run head first
          Phase 2:
          - Actor exists
      */

    };


  }
 };