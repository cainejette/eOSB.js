'use strict';
angular.module('app').controller('roundPreambleController', 
    ['$location', '$scope', function($location, $scope) {
      $scope.openRound = function() {
        console.log('opening round!');

        $location.path('/round');
      }      
    }]
);
