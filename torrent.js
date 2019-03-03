
/*
    Magical stuff so WebTorrent can work in the backend
*/

// IPC
const { ipcMain } = require('electron');

// Web torrent + subtitles extraction
let webtorrent = require('webtorrent'), MatroskaSubtitles = require('matroska-subtitles');

let client;

// Start downloading and streaming the torrent
ipcMain.on('torrent-start', (event, arg) => {
    stopTorrent();
    
    let magnetlink = arg;

    client = new webtorrent();

    client.add(magnetlink, (torrent) => {
        let file = torrent.files.find((file) => {
            return file.name.endsWith('.mkv');
        });

        // Create a read stream
        let stream = file.createReadStream();

        // Create a parser
        let parser = new MatroskaSubtitles();

        stream.pipe(parser);

        parser.on('subtitle', (subtitle, trackNumber) => {
            console.log(subtitle);
            event.reply("torrent-subtitle", subtitle);
        });

        let server = torrent.createServer();
        server.listen(5000);

        event.reply("torrent-stream", "http://localhost:5000/0");
    });
});

let stopTorrent = () => {
    if(client)
        client.destroy();
}

ipcMain.on('torrent-stop', (event, args) => stopTorrent());