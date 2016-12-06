'use strict';

const parser = require('xml2js');
const fs = require('fs');
const path = require('path');
var ipcRenderer = require('electron').ipcRenderer
const BrowserWindow = require('electron').remote.BrowserWindow

let round;
let round_number = 1;
let question_number = 0;
let question;
let opened_tcq = false;

document.querySelector('#round_1').addEventListener('click', () => open_round(1));
document.querySelector('#round_2').addEventListener('click', () => open_round(2));
document.querySelector('#round_3').addEventListener('click', () => open_round(3));
document.querySelector('#round_4').addEventListener('click', () => open_round(4));
document.querySelector('#round_5').addEventListener('click', () => open_round(5));
document.querySelector('#round_6').addEventListener('click', () => open_round(6));
document.querySelector('#round_7').addEventListener('click', () => open_round(7));
document.querySelector('#round_8').addEventListener('click', () => open_round(8));
document.querySelector('#round_9').addEventListener('click', () => open_round(9));
document.querySelector('#round_10').addEventListener('click', () => open_round(10));
document.querySelector('#round_11').addEventListener('click', () => open_round(11));
document.querySelector('#tcq_a').addEventListener('click', () => open_tcq('a'));
document.querySelector('#tcq_b').addEventListener('click', () => open_tcq('b'));
document.querySelector('#tcq_a_solution').addEventListener('click', () => open_tcq('a_solutions'));
document.querySelector('#tcq_b_solution').addEventListener('click', () => open_tcq('b_solutions'));
document.querySelector('#hide_tcq').addEventListener('click', () => hide_tcq());
document.querySelector('#prev').addEventListener('click', () => update_question(--question_number));
document.querySelector('#next_question').addEventListener('click', () => next_tossup());
document.querySelector('#next_tossup').addEventListener('click', () => update_question(++question_number));
document.querySelector('#choose_another').addEventListener('click', () => choose_round());

document.querySelector('#password').addEventListener('keydown', (e) => check_password(e));
document.querySelector('#submit').addEventListener('click', () => check_password());

document.querySelector('#show_tcq').addEventListener('click', () => display_tcqs());

document.querySelector('#password_error').setAttribute('style', 'display: none');
document.querySelector('#round_selection').setAttribute('style', 'display: none');
document.querySelector('#tcq_selection').setAttribute('style', 'display: none');
document.querySelector('#question').setAttribute('style', 'display: none');
document.querySelector('#inputs').setAttribute('style', 'display: none');
document.querySelector('#round_over').setAttribute('style', 'display: none');

function check_password(e) {
  if (e == undefined || e.keyCode == 13) {
    if (document.querySelector('#password').value === "asdf") {
      console.log('right');
      choose_round();
    } else {
      console.log('wrong');
      document.querySelector('#password').value = '';
      document.querySelector('#password').focus();
      document.querySelector('#password_error').setAttribute('style', 'display: visible');
    }
  } else {
    document.querySelector('#password_error').setAttribute('style', 'display: none');
  }
}

function display_tcqs() {
  document.querySelector('#question').setAttribute('style', 'display: none');
  document.querySelector('#inputs').setAttribute('style', 'display: none');
  document.querySelector('#tcq_selection').setAttribute('style', 'display: visible');
}

function choose_round() {
  document.querySelector('#round_selection').setAttribute('style', 'display: visible');
  document.querySelector('#user_authentication').setAttribute('style', 'display: none');
  document.querySelector('#question').setAttribute('style', 'display: none');
  document.querySelector('#inputs').setAttribute('style', 'display: none');
  document.querySelector('#round_over').setAttribute('style', 'display: none');
}

function open_round(new_round_number) {
  round_number = new_round_number;
  fs.readFile(path.join(__dirname, 'questions', `/round_${round_number}.xml`), function(err, data) {
    parser.parseString(data, function (err, result) {
      round = result.Round.Questions[0];
      document.querySelector('#question').setAttribute('style', 'display: visible');
      document.querySelector('#inputs').setAttribute('style', 'display: visible');
      document.querySelector('#round_selection').setAttribute('style', 'display: none');
      update_question(0);
    });
  });
}

function next_tossup() {
  // advance two questions if on tossup
  if (question_number % 2 == 0) {
    update_question(question_number + 2);
  } else {
    update_question(question_number + 1);
  }
}

function update_tcq_button() {
  if (question_number == 20 && !opened_tcq) {
    document.querySelector('#tcq').setAttribute('style', 'display: visible');
  } else {
    document.querySelector('#tcq').setAttribute('style', 'display: none');
  }
}

function update_question(new_question_number) {
  question_number = new_question_number;

  update_buttons(question_number);
  update_tcq_button();

  if (question_number < 40) {
    question = round.Question[question_number];
    
    document.querySelector('#question_type').textContent = question.QuestionType[0];
    document.querySelector('#question_number').textContent = question.QuestionPair[0];
    document.querySelector('#question_format').textContent = question.QuestionFormat[0].toLowerCase();

    document.querySelector('#question_text').textContent = question.QuestionText[0];
    if (question.QuestionFormat[0].toLowerCase() === 'multiple choice') {
      document.querySelector('#question_choices').setAttribute('style', 'display: visible');
      document.querySelector('#option_w').textContent = question.AnswerW[0];
      document.querySelector('#option_x').textContent = question.AnswerX[0];
      document.querySelector('#option_y').textContent = question.AnswerY[0];
      document.querySelector('#option_z').textContent = question.AnswerZ[0];
    } else {
      document.querySelector('#question_choices').setAttribute('style', 'display: none');
    }

    
    document.querySelector('#question_answer').textContent = question.CorrectAnswer[0];
  }
}

function update_buttons(question_number) {
  // disable back button on first question
  if (question_number == 0) {
    document.querySelector('#prev').setAttribute('disabled', 'disabled');
  }
  else {
    document.querySelector('#prev').removeAttribute('disabled');
  }

  // disable forward buttons on last question
  if (question_number == 40) {
    document.querySelector('#round_over').setAttribute('style', 'display: visible');
    document.querySelector('#question').setAttribute('style', 'display: none');
    document.querySelector('#next_question').setAttribute('disabled', 'disabled');
    document.querySelector('#next_tossup').setAttribute('disabled', 'disabled');
  } else {
    document.querySelector('#round_over').setAttribute('style', 'display: none')
    document.querySelector('#question').setAttribute('style', 'display: visible');
    document.querySelector('#next_question').removeAttribute('disabled');
    document.querySelector('#next_tossup').removeAttribute('disabled');
  }
}

function hide_tcq() {
  ipcRenderer.send('hide_tcq');
  update_tcq_button();
  document.querySelector('#question').setAttribute('style', 'display: visible');
  document.querySelector('#inputs').setAttribute('style', 'display: visible');
  document.querySelector('#tcq_selection').setAttribute('style', 'display: none');
};

function open_tcq(tcq_name) {
  opened_tcq = true;
  ipcRenderer.send('show_tcq', `./questions/tcq_${round_number}_${tcq_name}.pdf`);
};
