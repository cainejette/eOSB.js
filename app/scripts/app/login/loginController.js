(function () {
    'use strict';
    angular.module('app')
        .controller('loginController', ['$q', '$mdDialog', '$location', LoginController]);
    
    function LoginController($q, $mdDialog, $location) {
        var self = this;

        self.login = function() {
          $location.path('/rounds');
        }
    }
})();