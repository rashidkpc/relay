var path = require('path');

module.exports = function (kibana) {
  return new kibana.Plugin({

    name: 'relay',
    require: ['kibana', 'elasticsearch'],
    uiExports: {
      app: {
        title: 'Relay',
        description: 'I did what?!',
        main: 'plugins/relay/app',
        injectVars: function (server, options) {
          var config = server.config();
          return {
            kbnIndex: config.get('kibana.index'),
            esShardTimeout: config.get('elasticsearch.shardTimeout'),
            esApiVersion: config.get('elasticsearch.apiVersion')
          };
        }
      },
      modules: {
        flot_impact$: {
          path: path.resolve(__dirname, 'bower_components/flot/jquery.flot'),
          imports: 'jquery'
        },
        flotTime_impact$: {
          path: path.resolve(__dirname, 'bower_components/flot/jquery.flot.time'),
          imports: 'flot_impact'
        },
        flotPie_impact$: {
          path: path.resolve(__dirname, 'bower_components/flot/jquery.flot.pie'),
          imports: 'flot_impact'
        }
      }
    },
    config: function (Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    init: require('./init.js'),
  });
};
