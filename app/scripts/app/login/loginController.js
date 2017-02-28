(function () {
    'use strict';
    angular.module('app')
        .controller('loginController', ['$location', '$scope', LoginController]);
    
    function LoginController($location, $scope) {
        $scope.password = '';

        $scope.login = function() {
            if ($scope.password = 'hi') {
                $location.path('/rounds');
            }
            else {

            }
        }
    }
})();