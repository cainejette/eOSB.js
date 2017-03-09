'use strict';
angular.module('app').controller('roundPreambleController', 
    ['$location', '$scope', '$routeParams', function($location, $scope, $routeParams) {
      $scope.openRound = function() {
        console.log('opening round!');

        console.log('in round preamble... params: ' + $routeParams.file)
        $location.path(`/round/${$routeParams.file}`);
      }      
    }]
);
