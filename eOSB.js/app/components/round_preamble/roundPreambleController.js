'use strict';
angular.module('app').controller('roundPreambleController', 
    ['$location', '$scope', '$routeParams', function($location, $scope, $routeParams) {

      console.log('in round preamble... params: ' + $routeParams.file);

      $scope.openRound = function() {
        console.log('opening round!');
        $location.path(`/round/${$routeParams.file}/0/`);
      }      
    }]
);
