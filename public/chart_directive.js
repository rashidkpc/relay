var _ = require('lodash');
var $ = require('jquery');

require('flot');
require('flotTime');

var app = require('ui/modules').get('apps/relay', []);

app.directive('chart', function ($compile) {
  return {
    restrict: 'A',
    scope: {
      chart: '=',
      goal: '=',
      height: '=',
      min: '=',
      max: '='
    },
    link: function ($scope, $elem) {
      console.log('loaded chart');
      var defaultOptions = {
        xaxis: {
          mode: 'time',
          timezone: 'browser',
          tickLength: 0,
          color: '#ee0',
          font: { size: 13, color: '#666' }
        },
        grid: {
          backgroundColor: '#fff',
          borderWidth: 0,
          borderColor: null,
          margin: 10,
        },
        legend: {
          position: 'nw',
          labelBoxBorderColor: 'rgb(255,255,255,0)',
          labelFormatter: function (label, series) {
            return '<span class="ngLegendValue" ng-click="toggleSeries(' + series._id + ')">' + label + '</span>';
          }
        },
        yaxis: {
          min: $scope.min || 0,
          max: $scope.max,
          font: { size: 13, color: '#666' }

        },
        colors: ['#8c8'],
      };

      $scope.toggleSeries = function (id) {
        var series = $scope.chart[id];
        series._hide = !series._hide;
        drawPlot($scope.chart);
      };

      $(window).resize(function () {
        drawPlot($scope.chart);
      });

      $scope.$on('$destroy', function () {
        $(window).off('resize'); //remove the handler added earlier
      });

      function drawPlot(plotConfig) {
        $elem.height($scope.height || 250);

        if (!plotConfig || !plotConfig.length) {
          $elem.empty();
          return;
        }

        $scope.plot = $.plot($elem, $scope.chart, defaultOptions);

        _.each($elem.find('.ngLegendValue'), function (elem) {
          $compile(elem)($scope);
        });
      }

      $scope.$watch('chart', drawPlot);
      $scope.$watch('min', drawPlot);
      $scope.$watch('max', drawPlot);
      $scope.$watch('height', drawPlot);



    }
  };
});