'use strict';
angular.module('app').controller('roundPreambleController', 
  ['$location', '$scope', '$routeParams', function($location, $scope, $routeParams) {

    $scope.openRound = function() {
      $location.path(`/round/${$routeParams.file}/0/true`);
    };

  }]
);
