/*
    Electron entrypoint
    By: @ZoeyLovesMiki, 2019
*/

// Imports
const {BrowserWindow, app} = require('electron');

// Our window object
let MainWindow;

// Load our Window
app.on('ready', () => {
    // Install vue-devtools
    //require('vue-devtools').install();

    MainWindow = new BrowserWindow({
        show: false
    });
    
    MainWindow.loadFile(`${__dirname}/app.html`);

    MainWindow.setMenu(null);

    MainWindow.webContents.openDevTools();

    MainWindow.on('ready-to-show', () => {
        MainWindow.show();
    });
});

app.on('window-all-closed', () => {
    MainWindow = null;
    app.exit();
})