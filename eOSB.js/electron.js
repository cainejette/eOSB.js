require('electron-debug')();
require('electron-reload')(__dirname);

const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
var BrowserWindow = electron.BrowserWindow;
var mainWindow = null;
let teamNameWindow;

const ipcMain = require('electron').ipcMain;

const path = require('path');
const url = require('url');

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

var open_set_team_names_dialog = function() {
  teamNameWindow = new BrowserWindow({
    width: 800, 
    height: 400,
    parent: mainWindow,
    modal: true
  });

  teamNameWindow.center();
  teamNameWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app', 'components', 'team_name_dialog', 'team_name_dialog.html'),
    protocol: 'file:',
    slashes: true
  }));
  teamNameWindow.toggleDevTools();

  ipcMain.on('cancel_team_name_dialog', function() {
    if (teamNameWindow != null) {
      teamNameWindow.close();
      teamNameWindow = null;
    }
  });

  ipcMain.on('close_team_name_dialog', function(evt, teamAName, teamBName) {
    console.log(teamAName, teamBName);
    if (teamNameWindow != null) {
      teamNameWindow.close();
      teamNameWindow = null;
    }
  });
};

var open_round = function() {
  console.log('opening round.');
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {

  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 1400, height: 600 });

  const menuTemplate = [
    {
      label: 'eOSB',
      submenu: [
        {
          label: 'Quit',
          role: 'quit'
        }
      ]
    },
    {
      label: 'Options',
      submenu: [
        {
          'label': 'Open round', 
          'click': () => {
            open_round();
          }
        }, {
          type: 'separator'
        }, {
          label: 'Font Size',
          submenu: [
            {
              label: 'small',
              type: 'radio',
              click: () => {
                set_font_size('small');
              }
            }, {
              label: 'medium',
              type: 'radio',
              checked: true,
              click: () => {
                set_font_size('medium');
              }
            }, {
              label: 'large',
              type: 'radio',
              click: () => {
                set_font_size('large');
              }
            }, {
              label: 'extra large',
              type: 'radio',
              click: () => {
                set_font_size('extra-large');
              }
            }
          ]
        }, {
          'label': 'Set Team Names', 
          'click': () => {
            open_set_team_names_dialog();
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);


  var tcqWindow = new BrowserWindow({show: false});
  tcqWindow.setClosable(false);
  tcqWindow.maximize();

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  mainWindow.center();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {

    tcqWindow.setClosable(true);
    tcqWindow.close();
    tcqWindow = null;

    if (teamNameWindow != null) {
      teamNameWindow.setClosable(true);
      teamNameWindow.close();
      teamNameWindow = null;
    }

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  tcqWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app', 'components', 'tcqWindow', 'tcqWindow.html'),
    protocol: 'file:',
    slashes: true
  }));
  
  ipcMain.on('show_tcq', function(evt, arg) {
    console.log('[electron] hello!');
    tcqWindow.webContents.send('open_tcq', arg);
    tcqWindow.show();
  });

  ipcMain.on('close_tcqs', function() {
    tcqWindow.hide();
  });

});
