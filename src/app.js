/*
    Electron entrypoint
    By: @ZoeyLovesMiki, 2019
*/

// Imports
const {BrowserWindow, app} = require('electron');

// Our window object
let AnimeWindow;

// Load our Window
app.on('ready', () => {
    
    // Setup our BrowserWindow
    AnimeWindow = new BrowserWindow({
        show: false,
        icon: `${__dirname}/assets/icon.png`
    });
    
    // Load the html file
    AnimeWindow.loadFile(`${__dirname}/app.html`);

    // Remove the menu 
    // TODO: macOS menu
    AnimeWindow.setMenu(null);

    // Dev tools
    //if(process.argv.includes("DEBUG"))
        AnimeWindow.webContents.openDevTools();

    // Show the Window when it's ready
    AnimeWindow.on('ready-to-show', () => {
        AnimeWindow.show();
    });
});

// Exit when closing all windows
app.on('window-all-closed', () => {
    AnimeWindow = null;
    app.exit();
});