'use strict';
angular.module('app').controller('roundController', 
    ['$location', '$scope', function($location, $scope) {

      $scope.questions = undefined;
      $scope.selectedQuestionIndex = 0;
      $scope.question = undefined;

      $scope.question_number = 'hello';

      require('fs').readFile(__dirname + '/app/questions/round_1.xml', (readErr, xml) => {
        if (readErr) throw readErr;
        
        require('xml2js').parseString(xml, function (parseErr, json) {
          if (parseErr) throw parseErr;

          $scope.questions = json.Round.Questions[0].Question;
          $scope.question = $scope.questions[$scope.selectedQuestionIndex];
          console.dir($scope.questions);
          console.dir($scope.question);

          updateQuestion();
        });
      });

      var updateQuestion = function() {
        console.log('question number: ' + $scope.question_number);
        $scope.question_number = $scope.question.QuestionPair[0];
        console.log('question number: ' + $scope.question_number);
      }
    }]
);
