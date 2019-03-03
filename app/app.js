/*
    Spicyroll main entrypoint
    By: @ZoeyLovesMiki, 2019
*/

// Imports
let { BrowserWindow, app } = require('electron'),
    path = require('path');


// Electron window
let window;

// When the app is ready
app.on('ready', () => {
    // Create our Window
    window = new BrowserWindow({
        title: "Spicyroll",
        show: false,

        webPreferences: {
            nodeIntegration: true
        }
    });

    // Remove our menu
    window.setMenu(null);

    // Load our index file
    window.loadFile(path.resolve(__dirname, "index.html"));

    // Show the window when it's ready to show up
    window.on('ready-to-show', () => {
        window.show();
    });
});

// Exit when windows are all closed
app.on('window-all-closed', () => {
    window = null;
    app.exit(0);
})