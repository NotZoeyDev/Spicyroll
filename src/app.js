const {BrowserWindow, app} = require('electron');

let SpicyWindow;

app.on('ready', () => {
    SpicyWindow = new BrowserWindow({
        title: "Spicyroll~"
    });

    SpicyWindow.setMenu(null);

    SpicyWindow.webContents.openDevTools();

    SpicyWindow.loadFile(`${__dirname}/window.html`);
});