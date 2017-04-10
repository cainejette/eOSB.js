'use strict';

var _templateBase = './app/components/';

angular.module('app', [
    'ngRoute',
    'ngMaterial',
    'ngAnimate',
]).config(['$routeProvider', function ($routeProvider) {
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
        $routeProvider.when('/round/:file/:question/:showTcqReminder', {
            templateUrl: _templateBase + 'round/round.html' ,
            controller: 'roundController',
            controllerAs: '_ctrl',
            resolve: {
                round: function($route, RoundService) {
                    return RoundService.loadRound($route.current.params.file);
                }
            }
        })
        $routeProvider.when('/tcqReminder/:file/:question', {
            templateUrl: _templateBase + 'tcq_reminder/tcqReminder.html' ,
            controller: 'tcqReminderController',
            controllerAs: '_ctrl'
        })
        $routeProvider.when('/tcqs/:file/:question', {
            templateUrl: _templateBase + 'tcqs/tcqs.html' ,
            controller: 'tcqsController',
            controllerAs: '_ctrl',
            resolve: {
                tcqs: function($route, RoundService) {
                    return RoundService.loadTcqs($route.current.params.file)
                }
            }
        })
        $routeProvider.otherwise({ redirectTo: '/' });
    }
]);