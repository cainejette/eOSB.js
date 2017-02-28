(function () {
    'use strict';
    angular.module('app')
        .controller('roundsController', ['$q', '$mdDialog', '$location', RoundsController]);
    
    function RoundsController($q, $mdDialog, $location) {
        var self = this;
    }
})();