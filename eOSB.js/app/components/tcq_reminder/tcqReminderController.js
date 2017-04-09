'use strict';
angular.module('app').controller('tcqReminderController', 
  ['$location', '$scope', '$routeParams', function($location, $scope, $routeParams) {
    console.log('file: ' + $routeParams.file);
    console.log('question: ' + $routeParams.question);
    
    $scope.back_to_buzzers = function() {
      $location.path(`/round/${$routeParams.file}/${$routeParams.question}`);

    };

    $scope.open_tcqs = function() {
      $location.path(`/tcqs/${$routeParams.file}/${$routeParams.question}`);
    };
  }]
);