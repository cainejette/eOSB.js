'use strict';
angular.module('app').controller('roundsController', 
    ['$location', '$scope', function($location, $scope) {
        $scope.rounds = require('./app/questions/info.json');
    }]
);
