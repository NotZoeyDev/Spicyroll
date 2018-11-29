/*
    Spicy.JS
    -> Main code for the app.
*/

// Imports
const API = require('./api'), WebTorrent = require('WebTorrent'), spawn = require('child_process').spawn, path = require('path'), fs = require('fs');

// Fetch the animes list and add them to the page
API.fetchAnimes((episodes) => {
    for(let episode of episodes) {
        let episodeElement = document.createElement("p");
        episodeElement.innerText = episode.name;
        episodeElement.dataset.code = episode.code;
        document.querySelector("main").appendChild(episodeElement);

        episodeElement.addEventListener("click", (event) => {
            event.stopPropagation();

            API.fetchEpisodes(episodeElement.dataset.code, (data) => {
                openModal(episodeElement.innerText, data);
            });
        });
    }
});

// Show the modal for animes
let modal = document.querySelector(".modal");
let player = document.querySelector(".player");

function openModal(name, animeData) {
    modal.querySelector(".image img").src = animeData.image;
    modal.querySelector(".name").innerText = name;

    let episodesList = modal.querySelector(".episodes");

    for(let episode of animeData.episodes) {
        let episodeItem = document.createElement("li");
        episodeItem.innerText = `Episode ${episode.id}`;

        for(let quality in episode.quality) {
            let qualityItem = document.createElement("span");
            qualityItem.innerText = episode.quality[quality];
            qualityItem.addEventListener("click", (event) => {
                event.preventDefault();

                player.querySelector(".show").innerText = modal.querySelector(".name").innerText;
                player.querySelector(".episode").innerText = episode.id;

                playEpisode(episode.links[quality]);
            });

            episodeItem.appendChild(qualityItem);
        }

        episodesList.appendChild(episodeItem);
    }

    modal.dataset.show = "true";
}

modal.addEventListener("click", (event) => {
    if(event.target.className == "modal") {
        modal.dataset.show = "false";

        modal.querySelector(".image img").src = "";
        modal.querySelector(".name").innerText = "";
        modal.querySelector(".episodes").innerHTML = "";
    }
});

// Play an episode
function playEpisode(TorrentID) {
    let TorrentClient = new WebTorrent();

    TorrentClient.add(TorrentID, {
        path: path.normalize(`M:/Animes/${modal.querySelector(".name").innerText}/`) // CHANGE THIS TO THE PATH YOU WANT
    }, (torrent) => {
        let server = torrent.createServer();
        server.listen(5000);

        let process = spawn(`${path.normalize("C:\\Program Files\\DAUM\\PotPlayer\\PotPlayerMini64.exe")}`, ["http://localhost:5000/0"]); // CHANGE THIS TO THE PLAYER YOU WANT

        TorrentClient.on('torrent', (torrent) => {
            player.dataset.show = "true";
        });

        torrent.on('download', (bytes) => {
            player.querySelector(".speed").innerText = torrent.downloadSpeed;
            player.querySelector(".progress").innerText = `${Math.floor(torrent.progress * 100)}%`;
        });

        process.on('close', (code) => {
            server.close();
            torrent.destroy(() => {                
                player.dataset.show = "false";
                TorrentClient.destroy();
            })
        });
    });
}

// Search feature
let searchInput = document.querySelector('input[type="text"]');

searchInput.addEventListener("input", (event) => {
    let searchQuery = searchInput.value.trim().toLowerCase();

    let items = document.querySelectorAll("main p");
    for(let i of items) {
        i.style.display = i.innerText.toLowerCase().includes(searchQuery) ? "inline-block" : "none";
    }
});