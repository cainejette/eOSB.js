const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = require('electron').ipcMain;
const Menu = electron.Menu;

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let tcqWindow;
let teamNameWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 1200, height: 800});

  const menuTemplate = [
    {
      label: 'eOSB',
      submenu: [
        {
          label: 'Quit',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Options',
      submenu: [
        {
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

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '..', 'html', 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.webContents.openDevTools();
  mainWindow.center();

  var tcqWindow = new BrowserWindow({show: false});

  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    tcqWindow.setClosable(true);
    tcqWindow.close();
    tcqWindow = null;
  })
  
  tcqWindow.setClosable(false);
  tcqWindow.maximize();

  tcqWindow.loadURL(url.format({
    pathname: path.join(__dirname, '..', 'html', 'tcq.html'),
    protocol: 'file:',
    slashes: true
  }));

  ipcMain.on('show_tcq', function(evt, arg) {
    tcqWindow.webContents.send('open_tcq', arg);
    tcqWindow.show();
  });

  ipcMain.on('hide_tcq', function(evt, arg) {
    tcqWindow.hide();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
function set_font_size(size) {
  mainWindow.webContents.send('set_font_size', size);
}

function open_set_team_names_dialog() {
  teamNameWindow = new BrowserWindow({
    width: 800, 
    height: 400,
    parent: mainWindow,
    modal: true
  });
  teamNameWindow.center();
  teamNameWindow.loadURL(url.format({
    pathname: path.join(__dirname, '..', 'html', 'team_name.html'),
    protocol: 'file:',
    slashes: true
  }));

  ipcMain.on('cancel_team_name_dialog', function() {
    teamNameWindow.close();
  });

  ipcMain.on('close_team_name_dialog', function(evt, teamAName, teamBName) {
    console.log(teamAName, teamBName);
    teamNameWindow.close();
  });
}
