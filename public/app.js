var _ = require('lodash');

var logoUrl = require('./logo.png');

require('./main.less');
require('./chart_directive.js');
require('ui/filters/trust_as_html');

var config = {} //require('../relay.json');

var impactLogo = require('plugins/relay/impact.png');

require('ui/chrome')
.setBrand({
  'logo': 'url(' + impactLogo + ') left no-repeat',
  'smallLogo': 'url(' + impactLogo + ') left no-repeat'
}).setTabs([]);

var app = require('ui/modules').get('apps/relay', []);

// TODO: Expose an api for dismissing notifications
var unsafeNotifications = require('ui/notify')._notifs;
var ConfigTemplate = require('ui/ConfigTemplate');

require('ui/routes')
  .when('/', {
    template: require('plugins/relay/index.html'),
  });

app.controller('relay', function ($scope, $http, $timeout, $sce) {

  $scope.config = config;

  $http.get('/relay/blocks').then(function (resp) {
    var blockContext = require.context('../blocks');
    $scope.blockDefs = _.chain(blockContext.keys()).map(function (blockFile) {
      return blockContext(blockFile);
    }).indexBy('name').value();

    scoreTimer();
  });

  function scoreTimer() {
    $scope.getScores();
    $timeout(function () {
      scoreTimer();
    }, config.refresh_seconds * 1000);
  }


  $scope.getScores = function () {
    $http.get('/relay/scores').then(function (resp) {
      $scope.impact = resp.data.impact;
      $scope.actors = resp.data.actors;
      $scope.blocks = _.map(resp.data.blocks, function (block) {
        return _.extend(block, {blockDef: $scope.blockDefs[block.name]});
      });
      $scope.events = _.each(resp.data.events.hits, function (event) {
        _.extend(event, {blocks: _.map(event.matched_queries, function (blockName) {
            return $scope.blockDefs[blockName];
          })});
      });

      var goalCursor = 0;
      var goalBurn = _.map(resp.data.timeline, function (point) {
        goalCursor = goalCursor + point[1];
        return [point[0], (goalCursor / $scope.config.goal) * 100];
      });
      $scope.burn = [{data: goalBurn, shadowSize:0, lines: {lineWidth: 6}}];
      $scope.timeline = [{data: resp.data.timeline, shadowSize:0, lines: {lineWidth: 6}}];
    });
  };
});
