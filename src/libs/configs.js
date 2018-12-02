/*
    configs.js
    -> Configs manager or something
*/

const Store = require('electron-store'), remote = require('electron').remote, { BrowserWindow } = remote;

let configs = new class ConfigsManager {
    constructor() {
        this.store = new Store();
    }

    openSettings() {
        let setupWindow;

        setupWindow = new BrowserWindow({
            title: "Spicyroll Settings",
            show: false,
            width: 515,
            height: 170,
            resizable: false,
            parent: remote.getCurrentWindow(),
            maximizable: false,
            minimizable: false,
            modal: true
        });

        setupWindow.setMenu(null);

        setupWindow.loadFile(__dirname + "/../setup/setup.html");

        setupWindow.on('ready-to-show', () => {
            setupWindow.show();
        });
    }

    check() {
        if(!this.store.get("save")) {
            this.openSettings();
        }
    }

    saveSetting(setting, data) {
        this.store.set(setting, data);
    }

    getSetting(setting) {
        return this.store.get(setting);
    }
}

module.exports = configs;