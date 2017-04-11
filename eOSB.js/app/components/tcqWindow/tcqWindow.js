const ipcRenderer = require('electron').ipcRenderer
const PDFJS = require('pdfjs-dist-for-node');
const path = require('path');

ipcRenderer.on('open_tcq', (evt, arg) => {

  document.querySelector('#tcq').setAttribute('style', 'display: visible');
  
  PDFJS.disableWorker = true;
  console.dir(__dirname);

  PDFJS.workerSrc = path.join(__dirname, '..', '..', '..', '..', 'node_modules', 'pdfjs-dist-for-node', 'build', 'pdf.worker.js');

  var filePath = path.join('..', '..', arg);

  PDFJS.getDocument(filePath).then(function getPdfHelloWorld(pdf) {
    pdf.getPage(1).then(function getPageHelloWorld(page) {
      var scale = 1.5;
      var viewport = page.getViewport(scale);

      var canvas = document.querySelector('#tcq');
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
});