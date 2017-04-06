'use strict';
angular.module('app').controller('roundController', 
    ['$location', '$scope', '$routeParams', 'round', function($location, $scope, $routeParams, round) {
      
      var questions = round.Round.Questions[0].Question;
      $scope.questionIndex = $routeParams.question;
      $scope.question = questions[$scope.questionIndex];
      
      $scope.showTcqReminder = false;
      var hasOpenedTcqs = false;

      $scope.back = function() {
        if ($scope.questionIndex > 0) {
          $scope.questionIndex--;
          $scope.question = questions[$scope.questionIndex];
        }
      }

      $scope.next_tossup = function() {
        if ($scope.questionIndex < 40) {
          $scope.questionIndex % 2 == 0 ? $scope.questionIndex += 2 : $scope.questionIndex += 1;
          $scope.question = questions[$scope.questionIndex];

          checkTcqs();
        } 
        
        if ($scope.questionIndex > 39) {
          endRound();
        }
      }

      var checkTcqs = function() {
        if ($scope.questionIndex == 20 && !hasOpenedTcqs) {
          $scope.showTcqReminder = true;
          console.log('open tcqs!');
        }
      }

      $scope.next_question = function() {
        if ($scope.questionIndex < 40) {
          $scope.questionIndex++;
          $scope.question = questions[$scope.questionIndex];

          checkTcqs();  
        } 
        
        if ($scope.questionIndex > 39) {
          endRound();
        }
      }

      $scope.open_tcqs = function() {
        console.log('navigating to: ' + `/tcqs/${$routeParams.file}`);
        $location.path(`/tcqs/${$routeParams.file}/${$scope.questionIndex}`);
      }

      $scope.close_tcq_reminder = function() {
        $scope.showTcqReminder = false;
      }

      var endRound = function() {
        console.log('done!');
      }
    }]
);
