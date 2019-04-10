/*
    Start torrents and download them
*/

// Imports
const fs = require('fs'), path = require('path'), webtorrent = require('webtorrent'), ffmpeg = require('@ffmpeg-installer/ffmpeg').path, exec = require('child_process').exec;

// Express router
const router = require('express').Router();

// Stuff
let TorrentClient = null;
let TorrentServer = null;
let file = "";

const downloadFolder = `${require('os').homedir()}/Downloads/`;

router.post("/stream", (req, res) => {
    if(TorrentServer != null)
        TorrentServer.close();

    if(TorrentClient != null)
        TorrentClient.destroy();

    // Magnet link
    let magnet = req.body.url;
    let anime = req.body.anime;

    // Output folder for this stream
    let outputFolder = path.join(downloadFolder, anime.name);

    // Create a new WebTorrent client
    TorrentClient = new webtorrent();

    // Start the download
    TorrentClient.add(magnet, {
        path: outputFolder
    }, (torrent) => {
        TorrentServer = torrent.createServer();
        TorrentServer.listen(3001);

        // Check count
        let checkcount = 0;

        let checkProgress = setInterval(() => {
            checkcount += 1;

            if(checkcount == 100) {
                clearInterval(checkProgress);
            }

            if(torrent.progress > 5/100) {
                file = path.join(outputFolder, torrent.files[0].path);

                res.send({status: "ok"});
                clearInterval(checkProgress);
            }
        }, 500);
    });

    setTimeout(() => {
        if(TorrentClient && TorrentClient.torrents[0] && TorrentClient.torrents[0].progress < 5/100) {
            // Delete the video if it exists
            if(TorrentClient.torrents[0].files[0] && TorrentClient.torrents[0].files[0].path) {
                const videoPath = path.join(outputFolder, TorrentClient.torrents[0].files[0].path);
                
                if(fs.existsSync(videoPath)) {
                    fs.unlinkSync(videoPath);

                    const videoFolder = path.dirname(videoPath);

                    if(fs.readdirSync(videoFolder).length == 0) {
                        fs.rmdirSync(videoFolder);
                    }
                }
            }

            TorrentClient.destroy();
            res.send({error: "Couldn't load"});
        }
    }, 1000*30);
});

router.post("/stop", (req, res) => {
    if(TorrentServer)
        TorrentServer.close();

    if(TorrentClient)
        TorrentClient.destroy();

    res.send("ok");
});

router.get("/sub", (req, res) => {
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
    exec(ffmpeg + " " + ffmpegArgs.join(" "), (err, stdout, stderr) => {
        let done = true;

        // Check stderr to see if ffmpeg had error ("Aka download not finish");
        for(let line of stderr.split("\n")) {
            if(line.includes("Read error at pos.")) {
                done = false; 
                break;
            }
        }

        //let subfile = fs.readFileSync(output, {encoding: 'utf8'});
                
        res.sendFile(output);
    });
});

module.exports = router;