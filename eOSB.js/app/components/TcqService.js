'use strict';

var ipcRenderer = require('electron').ipcRenderer
let namesForIndices = ['a', 'b', 'a_solutions', 'b_solutions'];

angular.module('app').service('TcqService', function() {
  
  this.openTcq = function(round, index) {
    ipcRenderer.send('show_tcq', `./questions/tcq_${round}_${namesForIndices[index]}.pdf`);
  };

});
