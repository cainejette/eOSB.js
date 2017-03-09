'use strict';
angular.module('app').controller('roundsController', 
    ['$location', '$scope', function($location, $scope) {
        $scope.rounds = require('./app/questions/info.json');
        $scope.selectedRound = undefined;

        $scope.useScorekeeping = false;
        $scope.useTimekeeping = false;

        $scope.check = function(round) {
            $scope.selectedRound = round;
        }

        $scope.openRound = function() {
            console.log('use scorekeeper: ' + $scope.useScorekeeping);
            console.log('use timekeeper: ' + $scope.useTimekeeping);
            console.log('open round: ' + $scope.selectedRound.name);

            console.log('navigating to: ' + `/roundPreamble/${$scope.selectedRound.file}`);
            $location.path(`/roundPreamble/${$scope.selectedRound.file}`);
        }
    }]
);
