const ipcRenderer = require('electron').ipcRenderer

document.querySelector('#cancel_button').addEventListener('click', () => {
  ipcRenderer.send('cancel_team_name_dialog');
});

document.querySelector('#submit_button').addEventListener('click', () => {
  ipcRenderer.send(
    'close_team_name_dialog',
    document.querySelector('#team_a_name').value, 
    document.querySelector('#team_b_name').value);
});

