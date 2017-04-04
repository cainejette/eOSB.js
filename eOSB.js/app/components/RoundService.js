'use strict';

const fsp = require('fs-promise');
var xml2js = require('xml2js-es6-promise');

angular.module('app').service('RoundService', function() {
  
  this.load = function(round) {
    console.log('loading round: ' + round);
    return fsp
      .readFile(__dirname + `/app/questions/${round}`)
      .then(xml => {
        return xml2js(xml);
    });
  };

});
