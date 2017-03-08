'use strict';
angular.module('app').controller('roundController', 
    ['$location', '$scope', function($location, $scope) {

      var questions = '';
      $scope.question = '';
      $scope.questionIndex = -1;

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
        } 
        
        if ($scope.questionIndex > 39) {
          endRound();
        }
      }

      $scope.next_question = function() {
        if ($scope.questionIndex < 40) {
          $scope.questionIndex++;
          $scope.question = questions[$scope.questionIndex];
        } 
        
        if ($scope.questionIndex > 39) {
          endRound();
        }
      }

      var endRound = function() {
        console.log('done!');
      }

      require('fs').readFile(__dirname + '/app/questions/round_1.xml', (readErr, xml) => {
        if (readErr) throw readErr;
        
        require('xml2js').parseString(xml, function (parseErr, json) {
          if (parseErr) throw parseErr;

          questions = json.Round.Questions[0].Question;
          $scope.question = questions[$scope.questionIndex];
        });
      });
    }]
);
