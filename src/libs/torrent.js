/*
    Torrent.js
    -> Handles downloading + playing videos
*/

// Imports
const WebTorrent = require('webtorrent'), remote = require('electron').remote, path = require('path'), fs = require('fs'), spawn = require('child_process').spawn, configs = require('./configs');;
const Discord = require('./discord');

// Manages the speed/download interface
let DownloadManager = new class DownloadManager {
    constructor() {
        this.panel = document.querySelector(".player");
        this.window = remote.getCurrentWindow();
    }

    openPanel(streaming=false) {
        this.panel.querySelector(".method").innerText = streaming ? "Playing" : "Downloading";
        this.panel.querySelector(".show").innerText = window._anime;
        this.panel.querySelector(".episode").innerText = window._episode;

        this.window.setTitle(`Spicyroll | ${streaming ? "Playing" : "Downloading"} episode ${window._episode} of ${window._anime}`);
        Discord.setActivity(window._anime, window._episode, streaming);

        this.panel.dataset.show = "true";
    }

    updatePanel(speed, progress) {
        this.panel.querySelector(".speed").innerText = `${(speed / 1000000).toFixed(2)} Mb/s`;
        this.panel.querySelector(".progress").innerText = `${Math.floor(progress * 100)}%`;

        this.window.setProgressBar(progress);
    }

    stopWatching() {
        document.querySelector(".blocker").dataset.enable = "false";
        this.window.setTitle(`Spicyroll`);
        this.window.setProgressBar(-1);
        Discord.setActivity(null, null, false);
    }

    closePanel() {
        this.panel.dataset.show = "false";
        this.window.setProgressBar(-1);
    }
}

// Manages torrents + playback
class TorrentManager {
    // Download a specific episode
    downloadEpisode(MagnetURI, callback) {
        let TorrentClient = new WebTorrent();

        TorrentClient.add(MagnetURI, {
            path: path.normalize(`${configs.getSetting("save")}/${window._anime}/`)
        }, (torrent) => {
            TorrentClient.on('torrent', (torrent) => {
                DownloadManager.openPanel();
            });

            torrent.on('done', () => {
                DownloadManager.closePanel();
                DownloadManager.stopWatching();
                TorrentClient.destroy(() => {
                    callback();
                });
            });

            torrent.on('download', (bytes) => {
                DownloadManager.updatePanel(torrent.downloadSpeed, torrent.progress);
            });
        });
    }

    // Download an entire anime
    downloadAnime(quality, episodes, callback) {
        let magnetURIs = []; // MagnetURI of every episodes in the requested quality.

        let qualityIndex = episodes[0].quality.indexOf(quality);

        // Get the MagnetURI of every episodes request.
        for(let episode of episodes) {
            magnetURIs.push(episode.links[qualityIndex]);
        }

        // Recursive function for downloading every episodes
        let downloadEpisodes = () => {
            if(magnetURIs.length > 0) {
                window._episode = magnetURIs.length;
                this.downloadEpisode(magnetURIs[0], () => {
                    magnetURIs.splice(0, 1);
                    downloadEpisodes();
                });
            } else {
                callback();
            }
        }
        
        downloadEpisodes();
    }

    // Play/stream an episode
    playEpisode(MagnetURI, callback) {
        let TorrentClient = new WebTorrent();

        let downloaded = false;
        let playing = true;

        TorrentClient.add(MagnetURI, {
            path: path.normalize(`${configs.getSetting("save")}/${window._anime}/`)
        }, (torrent) => {
            TorrentClient.on('torrent', (torrent) => {
                DownloadManager.openPanel(true);

                let server = torrent.createServer();
                server.listen(1337);      
                
                let player = spawn(configs.getSetting("player"), ["http://localhost:1337/0"]);

                player.on('close', () => {
                    playing = false;
                    
                    if(downloaded) {
                        DownloadManager.stopWatching();
                        TorrentClient.destroy(() => {
                            callback();
                        })
                    }
                });
            });

            torrent.on('done', () => {
                downloaded = true;
                DownloadManager.closePanel();

                if(!playing) {
                    DownloadManager.stopWatching();
                    TorrentClient.destroy(() => {
                        callback();
                    });
                }
            });

            torrent.on('download', (bytes) => {
                DownloadManager.updatePanel(torrent.downloadSpeed, torrent.progress);
            });
        });
    }
}

module.exports = new TorrentManager();