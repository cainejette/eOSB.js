'use strict';
angular.module('app').controller('loginController',
    ['$location', '$scope', function ($location, $scope) {
        $scope.login = function () {
            if ($scope.password == 'hi') {
                $location.path('/rounds');
            }
            else {
                $scope.invalid_password = true;
                $scope.password = "";
            }
        }

        $scope.clear = function () {
            $scope.invalid_password = false;
        }
    }]
);