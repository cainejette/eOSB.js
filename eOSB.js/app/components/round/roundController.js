'use strict';
angular.module('app').controller('roundController', 
  ['$location', '$scope', '$routeParams', 'round', function($location, $scope, $routeParams, round) {
      
    var questions = round.Round.Questions[0].Question;
    $scope.questionIndex = parseInt($routeParams.question);
    $scope.question = questions[$scope.questionIndex];
    
    $scope.back = function() {
      if ($scope.questionIndex > 0) {
        $scope.questionIndex--;
        $scope.question = questions[$scope.questionIndex];
      }
    };

    $scope.next_tossup = function() {
      if ($scope.questionIndex < 40) {
        $scope.questionIndex % 2 == 0 ? $scope.questionIndex += 2 : $scope.questionIndex += 1;
        $scope.question = questions[$scope.questionIndex];

        checkTcqs();
      } 
      
      if ($scope.questionIndex > 39) {
        endRound();
      }
    };

    $scope.next_question = function() {
      if ($scope.questionIndex < 40) {
        $scope.questionIndex++;
        $scope.question = questions[$scope.questionIndex];

        checkTcqs();  
      } 
      
      if ($scope.questionIndex > 39) {
        endRound();
      }
    };

    $scope.select_round = function() {
      $location.path('/rounds');
    }

    var checkTcqs = function() {
      if ($scope.questionIndex == 20 && $routeParams.showTcqReminder == 'true') {
        $location.path(`/tcqReminder/${$routeParams.file}/${$scope.questionIndex}`);
      }
    };

    var endRound = function() {
      console.log('done!');
    };
    
  }]
);
