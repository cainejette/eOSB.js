(function () {
    'use strict';
    
    var _templateBase = './app/components/';
    
    angular.module('app', [
        'ngRoute',
        'ngMaterial',
        'ngAnimate'
    ])
    .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: _templateBase + 'login/login.html' ,
                controller: 'loginController',
                controllerAs: '_ctrl'
            });
            $routeProvider.when('/rounds', {
                templateUrl: _templateBase + 'rounds/rounds.html' ,
                controller: 'roundsController',
                controllerAs: '_ctrl'
            })
            $routeProvider.when('/roundPreamble/:file', {
                templateUrl: _templateBase + 'round_preamble/round_preamble.html' ,
                controller: 'roundPreambleController',
                controllerAs: '_ctrl'
            })
            $routeProvider.when('/round/:file', {
                templateUrl: _templateBase + 'round/round.html' ,
                controller: 'roundController',
                controllerAs: '_ctrl'
            })
            $routeProvider.otherwise({ redirectTo: '/' });
        }
    ]);

})();