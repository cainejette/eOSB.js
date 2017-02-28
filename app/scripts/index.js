(function () {
    'use strict';
    
    var _templateBase = './scripts';
    
    angular.module('app', [
        'ngRoute',
        'ngMaterial',
        'ngAnimate'
    ])
    .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: _templateBase + '/app/login/login.html' ,
                controller: 'loginController',
                controllerAs: '_ctrl'
            });
            $routeProvider.when('/rounds', {
                templateUrl: _templateBase + '/app/rounds/rounds.html' ,
                controller: 'roundsController',
                controllerAs: '_ctrl'
            })
            $routeProvider.otherwise({ redirectTo: '/' });
        }
    ]);

})();