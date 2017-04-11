require('electron-debug')();
require('electron-reload')(__dirname);

const electron = require('electron');
const app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var mainWindow = null;
const ipcMain = require('electron').ipcMain;

const path = require('path');
const url = require('url');

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {

  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 1400, height: 600 });
  var tcqWindow = new BrowserWindow({show: false});
  tcqWindow.setClosable(false);
  tcqWindow.maximize();

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {

    tcqWindow.setClosable(true);
    tcqWindow.close();
    tcqWindow = null;

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

});