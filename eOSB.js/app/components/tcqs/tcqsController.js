'use strict';
angular.module('app').controller('tcqsController', 
  ['$location', '$scope', '$routeParams', 'tcqs', 'TcqService', function($location, $scope, $routeParams, tcqs, TcqService) {

    $scope.tcqs = tcqs;

    $scope.open = function(index) {
      TcqService.openTcq($routeParams.file.split('.')[0].split('_')[1], index);
    };

    $scope.close = function() {
      TcqService.closeTcqs();
      $location.path(`/round/${$routeParams.file}/${$routeParams.question}/false`);
    };

  }]
);