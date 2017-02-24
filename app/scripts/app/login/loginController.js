(function () {
    'use strict';
    angular.module('app')
        .controller('loginController', ['$q', '$mdDialog', LoginController]);
    
    function LoginController($q, $mdDialog) {
        var self = this;
        // Load initial data
        login();
        
        //----------------------
        // Internal functions 
        //----------------------
        function login() {
          console.log('hi! login?');
        }
    }
})();