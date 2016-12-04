'use strict';

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var parser = require('xml2js');
var fs = require('fs');
var path = require('path');
var PDFJS = require('pdfjs-dist-for-node');

document.querySelector('#round_1').addEventListener('click', () => open(1));
document.querySelector('#round_2').addEventListener('click', () => open(2));
document.querySelector('#round_3').addEventListener('click', () => open(3));
document.querySelector('#round_4').addEventListener('click', () => open(4));
document.querySelector('#round_5').addEventListener('click', () => open(5));
document.querySelector('#round_6').addEventListener('click', () => open(6));
document.querySelector('#round_7').addEventListener('click', () => open(7));
document.querySelector('#round_8').addEventListener('click', () => open(8));
document.querySelector('#round_9').addEventListener('click', () => open(9));
document.querySelector('#round_10').addEventListener('click', () => open(10));
document.querySelector('#round_11').addEventListener('click', () => open(11));
document.querySelector('#tcq_a').addEventListener('click', () => open_tcq('a'));
document.querySelector('#tcq_b').addEventListener('click', () => open_tcq('b'));
document.querySelector('#tcq_a_solution').addEventListener('click', () => open_tcq('a_solutions'));
document.querySelector('#tcq_b_solution').addEventListener('click', () => open_tcq('b_solutions'));


document.querySelector('#hide_tcq').addEventListener('click', () => hide_tcq());



function hide_tcq() {
  document.querySelector('#the_canvas').setAttribute('style', 'display: none');
};

function open_tcq(tcq_name) {
  document.querySelector('#the_canvas').setAttribute('style', 'display: visible');
  console.log('opening tcq...');

  //
  // If absolute URL from the remote server is provided, configure the CORS
  // header on that server.
  //
  var url = `./questions/tcq_${round_number}_${tcq_name}.pdf`;

  //
  // Disable workers to avoid yet another cross-origin issue (workers need
  // the URL of the script to be loaded, and dynamically loading a cross-origin
  // script does not work).
  //
  PDFJS.disableWorker = true;

  //
  // The workerSrc property shall be specified.
  //
  // PDFJS.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.js';
  PDFJS.workerSrc = '';

  //
  // Asynchronous download PDF
  //
  PDFJS.getDocument(url).then(function getPdfHelloWorld(pdf) {
    //
    // Fetch the first page
    //
    pdf.getPage(1).then(function getPageHelloWorld(page) {
      var scale = 1.5;
      var viewport = page.getViewport(scale);

      //
      // Prepare canvas using PDF page dimensions
      //
      var canvas = document.querySelector('#the_canvas');
      var context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      //
      // Render PDF page into canvas context
      //
      var renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      page.render(renderContext);
    });
  });
};

let round;
let round_number = 1;
let question_number = 0;
let question;

document.querySelector('#prev').addEventListener('click', () => update_question(--question_number));
document.querySelector('#next').addEventListener('click', () => update_question(++question_number));

document.querySelector('#question').setAttribute('style', 'display: none');

function open(new_round_number) {
  round_number = new_round_number;
  fs.readFile(path.join(__dirname, 'questions', `/round_${round_number}.xml`), function(err, data) {
    parser.parseString(data, function (err, result) {
      console.log('round: ' + round_number);
      round = result.Round.Questions[0];

      document.querySelector('#question').setAttribute('style', 'display: visible');
      update_question(0);
    });
  });
}

function update_question(new_question_number) {
  question_number = new_question_number;
  question = round.Question[question_number];
  document.querySelector('#question_number').textContent = question.QuestionPair[0];

  
  
  console.dir(question);

  if (question.QuestionFormat[0] === 'Multiple Choice') {
    document.querySelector('#question_choices').setAttribute('style', 'display: visible');
    document.querySelector('#option_w').textContent = question.AnswerW[0];
    document.querySelector('#option_x').textContent = question.AnswerX[0];
    document.querySelector('#option_y').textContent = question.AnswerY[0];
    document.querySelector('#option_z').textContent = question.AnswerZ[0];
  } else {
    document.querySelector('#question_choices').setAttribute('style', 'display: none');
  }

  document.querySelector('#question_format').textContent = question.QuestionFormat[0];
  document.querySelector('#question_type').textContent = question.QuestionType[0];
  document.querySelector('#question_text').textContent = question.QuestionText[0];
  document.querySelector('#question_answer').textContent = question.CorrectAnswer[0];
}