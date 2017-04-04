'use strict';
angular.module('app').controller('tcqsController', 
    ['$location', '$scope', '$routeParams', function($location, $scope, $routeParams) {
      console.log('hi there! i am tcqs');

      console.log('question: ' + $routeParams.question);

      $scope.close = function() {
        $location.path(`/round/${$routeParams.file}/${$routeParams.question}`);
      }
    }]
);