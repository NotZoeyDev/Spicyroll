/*
    Handle the torrents + streaming them back to our app
    By @ZoeyLovesMiki, 2019
*/

// Imports
const WebTorrent = require('webtorrent'), fs = require('fs'), path = require('path'), ffmpeg = require('@ffmpeg-installer/ffmpeg').path.replace('app.asar', 'app.asar.unpacked'), { exec } = require('child_process');

// Methods goes here
export default {
    /**
     * Prepare WebTorrent and stuff
     */
    prepareWebTorrent(magnetLink, anime) {
        return new Promise((resolve, reject) => {
            // Our WebTorrent client
            const TorrentClient = new WebTorrent();

            // Download folder
            const downloadFolder = `${require('os').homedir()}/Downloads/${anime}/`;

            // Add the link to the client
            TorrentClient.add(magnetLink, {
                path: downloadFolder
            }, (torrent) => {
                let TorrentServer = torrent.createServer();
                TorrentServer.listen(3000);
            
                // Check count
                let checkcount = 0;

                let checkProgress = setInterval(() => {
                    checkcount += 1;

                    if(checkcount == 100) {
                        clearInterval(checkProgress);
                    }

                    if(torrent.progress > 5/100) {
                        resolve({server: TorrentServer, client: TorrentClient, file: path.join(downloadFolder, torrent.files[0].path)});
                        clearInterval(checkProgress);
                    }
                }, 500);
            });

            // Check if torrent is over 5 percent after 30 seconds
            setTimeout(() => {
                if(TorrentClient && TorrentClient.torrents[0] && TorrentClient.torrents[0].progress < 5/100) {
                    // Delete the video if it exists
                    if(TorrentClient.torrents[0].files[0] && TorrentClient.torrents[0].files[0].path) {
                        const videoPath = path.join(downloadFolder, TorrentClient.torrents[0].files[0].path);
                        
                        if(fs.existsSync(videoPath)) {
                            fs.unlinkSync(videoPath);

                            const videoFolder = path.dirname(videoPath);

                            if(fs.readdirSync(videoFolder).length == 0) {
                                fs.rmdirSync(videoFolder);
                            }
                        }
                    }

                    TorrentClient.destroy();
                    resolve(null);
                }
            }, 1000*30);
        });
    },

    /**
     * Extract subtitles from video
     */
    extractSubs(file) {
        return new Promise((resolve, reject) => {
            let output = `${path.dirname(file)}/${path.basename(file, '.mkv')}.vtt`

            // Ffmpeg arguments
            let ffmpegArgs = [
                "-y",
                "-i",
                `"${file}"`,
                "-map",
                "0:s:0",
                `"${output}"`
            ];

            // Extracts our subtitles
            let subtitleExtractor = () => {
                exec(ffmpeg + " " + ffmpegArgs.join(" "), (err, stdout, stderr) => {
                    let done = true;

                    // Check stderr to see if ffmpeg had error ("Aka download not finish");
                    for(let line of stderr.split("\n")) {
                        if(line.includes("Read error at pos.")) {
                            done = false; 
                            break;
                        }
                    }
                        
                    resolve(output, done);
                });
            };

            // Check if our file exists
            let checkFile = setInterval(() => {
                if(fs.existsSync(file)) {
                    subtitleExtractor();
                    clearInterval(checkFile);
                }
            }, 500);
        });
    },

    /**
     * Prepare WebTorrent, our media server and ffmpeg to do all the magic behind the scenes
     */
    streamEpisode(magnetLink, anime) {
        return new Promise((resolve, reject) => {

            // Prepare our Web Torrent Client
            this.prepareWebTorrent(magnetLink, anime).then((Torrent) => {
                
                // The episode could be loaded.
                if(Torrent) {
                    // Send back our data
                    resolve({
                        server: Torrent.server,
                        client: Torrent.client,
                        file: Torrent.file
                    });
                } else {
                    resolve(null);
                }
            });
        });
    }
}