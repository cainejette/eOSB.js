'use strict';

var PDFJS = require('pdfjs-dist');
const {BrowserWindow} = require('electron').remote
const url = require('url');
const path = require('path');

angular.module('app').service('TcqService', function() {
  
  this.openTcq = function(round, index) {
    console.log('trying to open pdf...', round, index);
    
    let win = new BrowserWindow({width: 800, height: 600})

    win.loadURL(url.format({
      pathname: path.join(__dirname, 'app', 'components', 'tcq.html'),
      protocol: 'file:',
      slashes: true
    }));
    // win.loadURL('./app/components/tcq.html');
    win.webContents.openDevTools();

  };

});
