const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain

const path = require('path')
const url = require('url')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter_db = new FileSync('db.json')
const adapter_config = new FileSync('config.json')
const db = low(adapter_db)
const config = low(adapter_config)

config.defaults({'bookType': ['小说']}).write()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {webSecurity: false}
    });

    // and load the index.html of the eapp.

    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    
    // hardwire
    // const startUrl = 'http://localhost:3000'

    mainWindow.loadURL(startUrl);
    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('save-data', (event, isbn, data) => {
    console.log(isbn)
    if (db.has(isbn).value()) {
        event.sender.send('save-data-reply', 'fail') 
    } else {
        db.set(isbn, data).write()
        event.sender.send('save-data-reply', 'success')
    }  
})

ipcMain.once('get-bookType', event => {
    event.returnValue = config.get('bookType').value()
})