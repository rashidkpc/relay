
var path = require('path');

module.exports = function (kibana) {
  return new kibana.Plugin({
    require: ['kibana'],
    uiExports: {
      app: {
        title: 'Relay',
        description: 'Team progress scoreboard',
        //icon: 'plugins/relay/icon.svg',
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
        }
      }
    },
    init: require('./init.js'),
  });
};
