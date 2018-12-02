const {BrowserWindow, app} = require('electron');

let SpicyWindow;

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

app.on('ready', () => {
    SpicyWindow = new BrowserWindow({
        title: "Spicyroll",
        icon: `${__dirname}/icon.png`,
        backgroundColor: "#1E1E1E",
        show: false
    });

    SpicyWindow.setMenu(null);

    SpicyWindow.loadFile(`${__dirname}/window.html`);

    SpicyWindow.on('ready-to-show', () => {
        SpicyWindow.show();
    })
});