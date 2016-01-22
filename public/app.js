var _ = require('lodash');

var logoUrl = require('./logo.png');

require('./main.less');
require('./chart_directive.js');
require('./pie_directive.js');
require('ui/filters/trust_as_html');

var config = require('../relay');

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

require('ui/routes').enable();

require('ui/routes')
  .when('/', {
    template: require('plugins/relay/index.html'),
  });

app.controller('relay', function ($scope, $http, $timeout, $sce) {

  $scope.config = config;

  function init() {
    scoreTimer();
  }

  var scoreContext = require.context('../server/sources', true, /.*\/scores\/.*\.js/);
  $scope.typeDefs = _.chain(scoreContext.keys())
    .map(scoreFile => scoreContext(scoreFile))
    .indexBy((scoreType, i) => scoreContext.keys()[i].split('/')[1] + ':' + scoreType.name)
    .value();

  function scoreTimer() {
    $scope.getScores();
    $timeout(function () {
      scoreTimer();
    }, config.refresh_seconds * 1000);
  }


  $scope.getScores = function () {
    $http.get('/relay/scores').then(function (resp) {
      $scope.score = resp.data.score;
      $scope.actors = resp.data.actors;
      $scope.events = resp.data.events.hits;

      $scope.types = resp.data.types;
      _.each($scope.types, type => {
        type.typeDef = $scope.typeDefs[type.name];
      });

      $scope.typePie = _.map($scope.types, type => {
        return {
          label: type.name,
          data: type.score,
          color: type.typeDef.color
        };
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

  init();
});
