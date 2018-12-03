/*
    Discord
    -> Add discord-rpc support
*/

const DiscordRPC = require('discord-rpc');
const clientId = "519281072853352457";

class DiscordHandler {
    constructor() {
        this.rpc = new DiscordRPC.Client({transport: 'ipc'});

        this.rpc.login({clientId}).catch((err) => {
            this.rpc = null;
        }).then(() => {
            this.setActivity(null, null, false);
        });
    }

    setActivity(anime, episode, streaming) {
        if(this.rpc) {
            let details = anime 
                ? streaming
                    ? "Watching an anime"
                    : "Downloading an anime"
                : "Browsing animes";

            let state = anime
                ? `${anime} episode ${episode}`
                : null;

            let activity = {
                details: details
            }

            if(anime && streaming) activity.startTimestamp = new Date();

            if(state) activity.state = state;

            this.rpc.setActivity(activity);
        }
    }
}

module.exports = new DiscordHandler();