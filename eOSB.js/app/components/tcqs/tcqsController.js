'use strict';
angular.module('app').controller('tcqsController', 
    ['$location', '$scope', '$routeParams', 'tcqs', function($location, $scope, $routeParams, tcqs) {

      $scope.tcqs = tcqs;

      $scope.close = function() {
        $location.path(`/round/${$routeParams.file}/${$routeParams.question}`);
      }
    }]
);