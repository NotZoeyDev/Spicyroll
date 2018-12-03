/*
    app.js
    -> Main entrypoint
*/

// Imports
const {BrowserWindow, app} = require('electron');

let SpicyWindow;

app.on('ready', () => {
    // Register our protocol
    app.setAsDefaultProtocolClient("spicyroll");

    // Create the window
    SpicyWindow = new BrowserWindow({
        title: "Spicyroll",
        show: false,
        icon: `${__dirname}/icon.png`,
        backgroundColor: "#1E1E1E",
    });

    // Remove the default menu
    SpicyWindow.setMenu(null);

    // Hacky way to get the process arguments pass to the renderer
    SpicyWindow.arguments = process.argv;

    // Load our page
    SpicyWindow.loadFile(`${__dirname}/window.html`);

    // Adds a bit of delay but at least the app doesn't look like it's not loading at launch.
    SpicyWindow.on('ready-to-show', () => {
        SpicyWindow.show();
    });
});

// Handles closing the app correctly
app.on('window-all-closed', () => {
    SpicyWindow = null;
    app.exit(0);
});