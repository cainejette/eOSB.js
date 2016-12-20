'use strict';

const parser = require('xml2js');
const fs = require('fs');
const path = require('path');
var ipcRenderer = require('electron').ipcRenderer
const BrowserWindow = require('electron').remote.BrowserWindow

let questions;
let round_number = 1;
let question_number = 0;
let question;
let opened_tcq = false;
let is_using_scoring = false;
let is_using_timer = false;

let round;
let rounds = require('../questions/info.json');

document.querySelectorAll('.score_button').forEach(button => {
  button.addEventListener('click', (evt, other) => score_button_clicked(evt, other));
});

function score_button_clicked(evt) {
  let source_button = (evt.path[0].tagName == 'IMG') ? evt.path[1] : evt.path[0];
  let teamAClick = source_button.htmlFor.split('_')[1] == 'a' ? true : false;
  let teamBClick = source_button.htmlFor.split('_')[1] == 'b' ? true : false;
  
  let teamAResult, teamBResult;
  if (teamAClick) {
    teamAResult = source_button.htmlFor.split('_')[2];
    let teamBButton = document.querySelector('input[name="team_b"]:checked')
    if (teamBButton) {
      teamBResult = teamBButton.id.split('_')[2];
    }
  } else if (teamBClick) {
    teamBResult = source_button.htmlFor.split('_')[2];
    let teamAButton = document.querySelector('input[name="team_a"]:checked')
    if (teamAButton) {
      teamAResult = teamAButton.id.split('_')[2];
    }
  }

  let teamAScore = 0;
  if (teamAResult == 'correct') {
    teamAScore = 4;
  } else if (teamAResult == 'interrupt') {
    teamAScore = -4;
  } else {
    teamAScore = 0;
  }

  let teamBScore = 0;
  if (teamBResult == 'correct') {
    teamBScore = 4;
  } else if (teamBResult == 'interrupt') {
    teamBScore = -4;
  } else {
    teamBScore = 0;
  }

  if (teamAResult == 'correct' || teamBResult == 'correct' || 
          (teamAResult != undefined && teamBResult != undefined)) {
    ipcRenderer.send('score', teamAScore, teamBScore);
    console.log('resetting...');
    
    let teamAButton = document.querySelector('input[name="team_a"]:checked')
    if (teamAButton) {
      console.log('resetting team A...');
      teamAButton.checked = false;
    }

    let teamBButton = document.querySelector('input[name="team_b"]:checked')
    if (teamBButton) {
      console.log('resetting team B...');
      teamBButton.checked = false;
    }
  }
}

build_round_buttons();
$('[data-toggle="tooltip"]').tooltip();
document.querySelector('#tcq_a').addEventListener('click', () => open_tcq('a'));
document.querySelector('#tcq_b').addEventListener('click', () => open_tcq('b'));
document.querySelector('#tcq_a_solution').addEventListener('click', () => open_tcq('a_solutions'));
document.querySelector('#tcq_b_solution').addEventListener('click', () => open_tcq('b_solutions'));
document.querySelector('#hide_tcq').addEventListener('click', () => hide_tcq());
document.querySelector('#prev').addEventListener('click', () => update_question(question_number - 1));
document.querySelector('#next_question').addEventListener('click', () => next_tossup());
document.querySelector('#next_tossup').addEventListener('click', () => update_question(question_number + 1));
document.querySelector('#choose_another').addEventListener('click', () => show_user_validation());

document.querySelector('#password').addEventListener('keydown', (e) => check_password(e));
document.querySelector('#submit').addEventListener('click', () => check_password());

document.querySelector('#password_error').setAttribute('style', 'display: none');
document.querySelector('#round_selection').setAttribute('style', 'display: none');
document.querySelector('#tcq_selection').setAttribute('style', 'display: none');
document.querySelector('#question').setAttribute('style', 'display: none');
document.querySelector('#inputs').setAttribute('style', 'display: none');
document.querySelector('#inputs_scoring').setAttribute('style', 'display: none');
document.querySelector('#round_over').setAttribute('style', 'display: none');
document.querySelector('#round_preamble').setAttribute('style', 'display: none');

document.querySelector('label[for="timekeeping"]').addEventListener('click', () => {
  document.querySelector('input[name="timekeeping"]').click();
});

document.querySelector('label[for="scorekeeping"]').addEventListener('click', () => {
  document.querySelector('input[name="scorekeeping"]').click();
});

function build_round_buttons() {
  var div = document.createElement('ul');
  div.id = "rounds";
  div.setAttribute('class', 'row switch-field');
  document.querySelector('#round_list_hook').appendChild(div);

  document.querySelector('#open_round_button').addEventListener('click', () => open_round());

  rounds.forEach(round => {
    var input = document.createElement('input');
    input.id = round.file.split('.')[0];
    input.setAttribute('type', 'radio')
    input.setAttribute('name', 'rounds');
    div.appendChild(input);

    var label = document.createElement('label');
    label.setAttribute('for', input.id);
    label.setAttribute('class', 'col-xs-4');
    label.textContent = round.name;
    div.appendChild(label);
  });
}

function set_checked(source) {
  var prevSelected = document.querySelector('button[checked="checked"]');
  if (prevSelected) {
    prevSelected.removeAttribute('checked');
  }
  source.srcElement.setAttribute('checked', 'checked');
}

function show_user_validation() {
  document.querySelector('#user_authentication').setAttribute('style', 'display: visible');
  document.querySelector('#round_over').setAttribute('style', 'display: none');
  document.querySelector('#inputs').setAttribute('style', 'display: none');
  document.querySelector('#inputs_scoring').setAttribute('style', 'display: none');
}

function check_password(e) {
  if (e == undefined || e.keyCode == 13) {
    if (document.querySelector('#password').value === "") {
      choose_round();
    } else {
      document.querySelector('#password').value = '';
      document.querySelector('#password').focus();
      document.querySelector('#password_error').setAttribute('style', 'display: visible');
    }
  } else {
    document.querySelector('#password_error').setAttribute('style', 'display: none');
  }
}

function display_tcqs() {
  opened_tcq = true;
  document.querySelector('#question').setAttribute('style', 'display: none');
  document.querySelector('#inputs').setAttribute('style', 'display: none');
  document.querySelector('#tcq_selection').setAttribute('style', 'display: visible');
}

function choose_round() {
  document.querySelector('#rounds').remove();
  build_round_buttons();

  document.querySelector('#round_selection').setAttribute('style', 'display: visible');
  document.querySelector('#user_authentication').setAttribute('style', 'display: none');
  document.querySelector('#question').setAttribute('style', 'display: none');
  document.querySelector('#inputs').setAttribute('style', 'display: none');
  document.querySelector('#inputs_scoring').setAttribute('style', 'display: none');
  document.querySelector('#round_over').setAttribute('style', 'display: none');
}

function open_round() {
  opened_tcq = false;
  is_using_scoring = document.querySelector('input[name="scorekeeping"]').checked; 
  is_using_timer = document.querySelector('input[name="timekeeping"]').checked;

  if (is_using_scoring || is_using_timer) {
    ipcRenderer.send('init_info_screen');
  }

  let round_id = document.querySelector('input:checked').getAttribute('id');
  round = rounds.find(x => x.file.indexOf(round_id) != -1);
  if (round) {
    round.opened = true;
  }

  document.querySelector('#round_selection').setAttribute('style', 'display: none');
  document.querySelector('#round_preamble').setAttribute('style', 'display: visible');
  document.querySelector('#open_round_button_for_real').addEventListener('click', () => open_round_for_real());

  round_number = round.file.split('_')[1].split('.')[0];
  round.opened = true;
}

function open_round_for_real() {
  fs.readFile(path.join(__dirname, '../questions', `/${round.file}`), function(err, data) {
    parser.parseString(data, function (err, result) {
      questions = result.Round.Questions[0];
      document.querySelector('#question').setAttribute('style', 'display: visible');

      is_using_scoring 
        ? document.querySelector('#inputs_scoring').setAttribute('style', 'display: visible')
        : document.querySelector('#inputs').setAttribute('style', 'display: visible'); 

      document.querySelector('#round_preamble').setAttribute('style', 'display: none');
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

function update_question(new_question_number) {
  if (new_question_number > -1 && new_question_number < 41) {
    question_number = new_question_number;
    update_buttons(question_number);

    if (question_number < 40) {
      question = questions.Question[question_number];
      document.querySelector('#question_type').textContent = question.QuestionType[0].toLowerCase();

      if (question.QuestionType[0] == 'Bonus') {
        document.querySelector('#prompt').setAttribute('style', 'background-color: lemonchiffon');
        document.querySelector('#answer').setAttribute('style', 'background-color: lemonchiffon');
        document.querySelector('#next_tossup').setAttribute('data-original-title', 'to next tossup');

        if (is_using_scoring) {
          document.querySelectorAll('.correct_point_value').forEach(span => {
            span.textContent = '(+10)';
          });
          document.querySelectorAll('.incorrect_point_value').forEach(span => {
            span.textContent = '(+0)';
          });
          document.querySelectorAll('.interrupt_point_value').forEach(span => {
            span.textContent = '(-0)';
          });
        }
      } else {
        document.querySelector('#prompt').setAttribute('style', 'background-color: white');
        document.querySelector('#answer').setAttribute('style', 'background-color: white');
        document.querySelector('#next_tossup').setAttribute('data-original-title', 'to the bonus')

        if (is_using_scoring) {
          document.querySelectorAll('.correct_point_value').forEach(span => {
            span.textContent = '(+4)';
          });
          document.querySelectorAll('.incorrect_point_value').forEach(span => {
            span.textContent = '(+0)';
          });
          document.querySelectorAll('.interrupt_point_value').forEach(span => {
            span.textContent = '(-4)';
          });
        }
      }

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

      if (question_number == 20 && !opened_tcq) {
        display_tcqs();
      }

    }
  }
}

function update_buttons(question_number) {
  // disable back button on first question
  if (question_number == 0) {
    document.querySelector('#prev').setAttribute('disabled', 'disabled');
    document.querySelector('#prev').removeAttribute('data-original-title');
  }
  else {
    document.querySelector('#prev').removeAttribute('disabled');

  (question_number % 2) 
    ? document.querySelector('#prev').setAttribute('data-original-title', 'back to last tossup')
    : document.querySelector('#prev').setAttribute('data-original-title', 'back to last bonus');
  }

  // disable forward buttons on last question
  if (question_number == 40) {
    document.querySelector('#round_over').setAttribute('style', 'display: visible');
    document.querySelector('#question').setAttribute('style', 'display: none');
    document.querySelector('#next_question').setAttribute('disabled', 'true');
    document.querySelector('#next_tossup').setAttribute('disabled', 'true');
    document.querySelector('#next_question').removeAttribute('data-original-title');
    document.querySelector('#next_tossup').removeAttribute('data-original-title');
  } else {
    document.querySelector('#round_over').setAttribute('style', 'display: none')
    document.querySelector('#question').setAttribute('style', 'display: visible');
    document.querySelector('#next_question').removeAttribute('disabled');
    document.querySelector('#next_tossup').removeAttribute('disabled');
  }
}

function hide_tcq() {
  ipcRenderer.send('hide_tcq');
  document.querySelector('#question').setAttribute('style', 'display: visible');

  is_using_scoring 
    ? document.querySelector('#inputs_scoring').setAttribute('style', 'display: visible')
    : document.querySelector('#inputs').setAttribute('style', 'display: visible');
  document.querySelector('#tcq_selection').setAttribute('style', 'display: none');
};

function open_tcq(tcq_name) {
  ipcRenderer.send('show_tcq', `./questions/tcq_${round_number}_${tcq_name}.pdf`);
};

var ipcRenderer = require('electron').ipcRenderer

ipcRenderer.on('set_font_size', (event, size) => {
  document.querySelector('#content').setAttribute('class', 'container-fluid ' + size);
});