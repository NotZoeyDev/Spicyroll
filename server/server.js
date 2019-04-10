/*
    Express server that's doing all the job
*/

// Our express server
let server = require('./express.js');

// Load our router
server.use(require('./router/main'));

// Anime router
server.use("/animes", require("./router/animes"));

// Torrent router
server.use("/torrent", require("./router/torrent"));

// Start the server
server.listen(3000, () => {
    console.log("owo");
});