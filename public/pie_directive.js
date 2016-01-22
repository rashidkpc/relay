var _ = require('lodash');
var $ = require('jquery');

require('flot_impact');
require('flotPie_impact');

var app = require('ui/modules').get('apps/relay', []);

app.directive('pie', function ($compile) {
  return {
    restrict: 'A',
    scope: {
      pie: '=',
      height: '='
    },
    link: function ($scope, $elem) {
      console.log('loaded pie');
      var defaultOptions = {
        series: {
          pie: {
            show: true,
            radius: 100,
            label: {
              formatter: function (label, series) {
                return `<div class="pie-label" style="color:${series.color}">${label}: ${Math.floor(series.percent)}%</div>`;
              },
              show: true,
              radius: 130
            },
            combine: {
              threshold: 0.04,
              color: '#666'
            }
          }
        },
        legend: {
          show: false
        }
      };

      $(window).resize(function () {
        drawPlot($scope.pie);
      });

      $scope.$on('$destroy', function () {
        $(window).off('resize'); //remove the handler added earlier
      });

      function drawPlot(plotConfig) {
        $elem.height($scope.height || 350);

        if (!plotConfig || !plotConfig.length) {
          $elem.empty();
          return;
        }

        $scope.plot = $.plot($elem, $scope.pie, defaultOptions);
      }

      $scope.$watch('pie', drawPlot);
      $scope.$watch('height', drawPlot);

    }
  };
});
