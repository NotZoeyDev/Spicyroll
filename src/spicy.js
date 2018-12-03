/*
    Spicy.JS
    -> UI code for the app.
*/

// Imports
const API = require('./libs/api'), torrent = require('./libs/torrent'), configs = require('./libs/configs');
const { remote } = require('electron'), { Menu } = remote;

// Div used to block user input while doing stuff
let blocker = document.querySelector(".blocker");

// Manage the modal
let modal = new class ModalManager {
    constructor() {
        this.modal = document.querySelector(".view");
        this.background = document.querySelector(".modal");

        this.background.addEventListener("click", (event) => this.closeBackground(event));
    }

    closeBackground(event) {
        if(event.target.className == "modal") {
            this.background.dataset.show = "false";
            window._anime = null;
    
            this.modal.querySelector(".image img").src = "";
            this.modal.querySelector(".name").innerText = "";
            this.modal.querySelector(".episodes").innerHTML = "";
            this.modal.dataset.show = "false";
        }
    }

    showBackground() {
        this.background.dataset.show = "true";
    }

    openModal(animeData) {
        this.showBackground();

        this.modal.querySelector(".image img").src = animeData.image;
        this.modal.querySelector(".name").innerText = window._anime;

        let episodesList = this.modal.querySelector(".episodes");

        for(let episode of animeData.episodes) {
            let episodeItem = document.createElement("li");
            episodeItem.innerText = `Episode ${episode.id}`;

            for(let quality in episode.quality) {
                let qualityItem = document.createElement("span");
                qualityItem.innerText = episode.quality[quality];

                qualityItem.addEventListener("click", (event) => {
                    event.preventDefault();

                    window._episode = episode.id;
                    blocker.dataset.enable = "true";

                    torrent.playEpisode(episode.links[quality], () => {
                        blocker.dataset.enable = "false";
                    });
                });

                qualityItem.addEventListener("contextmenu", (event) => {
                    event.preventDefault();

                    window._episode = episode.id;
                    blocker.dataset.enable = "true";

                    torrent.downloadEpisode(episode.links[quality], () => {
                        blocker.dataset.enable = "false";
                    });
                });

                episodeItem.appendChild(qualityItem);
            }

            episodesList.appendChild(episodeItem);
        }

        this.modal.dataset.show = "true";
    }
}

configs.check();

// Fetch the animes list and add them to the page
API.fetchAnimes((animes) => {
    for(let anime of animes) {
        let animeElement = document.createElement("p");
        animeElement.innerText = anime.name;
        document.querySelector("main").appendChild(animeElement);

        // Open the episode selection screen
        animeElement.addEventListener("click", (event) => {
            API.fetchEpisodes(anime.code, (data) => {
                window._anime = anime.name;
                modal.openModal(data);
            });
        });

        // Extra option/context menu
        animeElement.addEventListener("contextmenu", (event) => {
            event.preventDefault();

            API.fetchEpisodes(anime.code, (data) => {
                let contextMenuTemplate = [];

                let downloadItem = {
                    label: "Download anime",
                    submenu: []
                };

                let qualities = data.episodes[0].quality;

                for(let quality of qualities) {
                    downloadItem.submenu.push({
                        label: quality,
                        click: () => {
                            window._anime = anime.name;

                            modal.showBackground();

                            torrent.downloadAnime(quality, data.episodes, () => {
                                window._anime = null;
                                modal.closeBackground();
                            });
                        }
                    });
                }

                contextMenuTemplate[0] = downloadItem;

                let animeContextMenu = Menu.buildFromTemplate(contextMenuTemplate);
                animeContextMenu.popup({window: remote.getCurrentWindow()});
            });
        });
    }

    // Handles the protocol stuff
    let args = remote.getCurrentWindow().arguments;
    console.log(args);

    if(args.length == 2) {
        let animeName = args[1].replace("spicyroll://", "").split("_").join(" ").trim().toLowerCase();

        let items = document.querySelectorAll("main p");
        for(let i of items) {
            if(i.innerText.toLowerCase() == animeName.substring(0, animeName.length - 1)) {
                i.click();
                break;
            }
        }
    }
});

// Search feature
let searchInput = document.querySelector('input[type="text"]');

searchInput.addEventListener("input", (event) => {
    let searchQuery = searchInput.value.trim().toLowerCase();

    let items = document.querySelectorAll("main p");
    for(let i of items) {
        i.style.display = i.innerText.toLowerCase().includes(searchQuery) ? "inline-block" : "none";
    }
});

// Open settings
document.querySelector("nav h2").addEventListener("click", (event) => {
    event.preventDefault();
    configs.openSettings();
});