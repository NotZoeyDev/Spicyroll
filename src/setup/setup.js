/*
    Setup.js
    -> Handles changing settings
*/

const configs = require('../libs/configs'), path = require('path'), remote = require('electron').remote, { dialog } = remote;

new class Settings {
    constructor() {
        document.querySelector("#location").addEventListener("click", (event) => this.locationClick(event));
        document.querySelector("#player").addEventListener("click", (event) => this.playerClick(event));

        let locationText = document.querySelector("#location-text");
        locationText.addEventListener("input", (event) => {
            configs.saveSetting("save", locationText.value);
        });

        let playerText = document.querySelector("#player-text");
        playerText.addEventListener("input", (event) => {
            configs.saveSetting("player", playerText.value);
        });

        if(configs.getSetting("save")) locationText.value = configs.getSetting("save");
        if(configs.getSetting("player")) playerText.value = configs.getSetting("player");
    }

    locationClick(event) {
        event.preventDefault();

        dialog.showOpenDialog(remote.getCurrentWindow(), {
            title: "Save location",
            properties: ["openDirectory"]
        }, (filePaths, bookmarks) => {
            if(filePaths && filePaths.length > 0) {
                configs.saveSetting("save", path.normalize(filePaths[0]));
                document.querySelector("#location-text").value = configs.getSetting("save");
            }
        });
    }

    playerClick(event) {
        event.preventDefault();

        dialog.showOpenDialog(remote.getCurrentWindow(), {
            title: "Player location",
            properties: ["openFile"]
        }, (filePaths, bookmarks) => {
           if(filePaths && filePaths.length > 0) {
               configs.saveSetting("player", path.normalize(filePaths[0]));
               document.querySelector("#player-text").value = configs.getSetting("player");
            } 
        });
    }
}