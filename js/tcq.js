const ipcRenderer = require('electron').ipcRenderer
const PDFJS = require('pdfjs-dist-for-node');

ipcRenderer.on('open_tcq', (evt, arg) => {
  console.log('open the tcq: ' + arg);

  document.querySelector('#tcq').setAttribute('style', 'display: visible');
  
  PDFJS.disableWorker = true;
  PDFJS.workerSrc = '';

  PDFJS.getDocument(arg).then(function getPdfHelloWorld(pdf) {
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
})