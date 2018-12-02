const {BrowserWindow, app} = require('electron');

let SpicyWindow;

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

app.on('ready', () => {
    SpicyWindow = new BrowserWindow({
        title: "Spicyroll"
    });

    SpicyWindow.webContents.openDevTools();

    SpicyWindow.setMenu(null);

    SpicyWindow.loadFile(`${__dirname}/window.html`);
});