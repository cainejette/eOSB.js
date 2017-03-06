'use strict';
angular.module('app').controller('roundController', 
    ['$location', '$scope', function($location, $scope) {

      var questions = '';
      $scope.question = '';
      var questionIndex = -1;

      require('fs').readFile(__dirname + '/app/questions/round_1.xml', (readErr, xml) => {
        if (readErr) throw readErr;
        
        require('xml2js').parseString(xml, function (parseErr, json) {
          if (parseErr) throw parseErr;

          questions = json.Round.Questions[0].Question;

        });
      });

      $scope.back = function() {
        console.log('back!');
        questionIndex--;
        $scope.question = questions[questionIndex];
      }

      $scope.next_tossup = function() {
        console.log('next tossup!');
      }

      $scope.next_question = function() {
        console.log('next question!');
        questionIndex++;
        $scope.question = questions[questionIndex];
        console.log('[' + $scope.question.QuestionType[0] + ']');
      }
    }]
);
