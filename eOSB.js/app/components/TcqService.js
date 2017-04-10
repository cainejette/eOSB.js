'use strict';

var PDFJS = require('pdfjs-dist');
const {BrowserWindow} = require('electron').remote
const url = require('url');
const path = require('path');

angular.module('app').service('TcqService', function() {
  
  let namesForIndices = ['a', 'b', 'a_solutions', 'b_solutions'];

  this.openTcq = function(round, index) {
    console.log('trying to open pdf...', round, namesForIndices[index]);
    
    let tcqWindow = new BrowserWindow({width: 800, height: 600})

    tcqWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'app', 'components', 'tcq.html'),
      protocol: 'file:',
      slashes: true
    }));

    var tcqPath = `${__dirname}/app/questions/tcq_${round}_${namesForIndices[index]}.pdf`;
    console.log('opening: ', tcqPath);
    
    PDFJS.disableWorker = true;

    PDFJS.workerSrc = `${__dirname}/../node_modules/pdfjs-dist/build/pdf.worker.js`;
    // PDFJS.workerSrc = '';

    PDFJS.getDocument(tcqPath).then(function getPdfHelloWorld(pdf) {
      pdf.getPage(1).then(function getPageHelloWorld(page) {
        var scale = 1.5;
        var viewport = page.getViewport(scale);

        console.dir(page);
        console.dir(document);
        var canvas = document.querySelector('#tcq');
        console.dir(canvas);
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext);
      });
    });

    tcqWindow.webContents.openDevTools();

  };

});
