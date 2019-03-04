/*
    Discord RPC and shit
    By @ZoeyLovesMiki, 2019
*/

// Imports
const DiscordRPC = require('discord-rpc');

// ClientID for Spicyroll
const ClientID = "519281072853352457";

// Our Discord RPC class
export default class {
    constructor() {
        this.client = new DiscordRPC.Client({transport: "ipc"});

        this.client.login({clientId: ClientID});

        this.client.on('ready', () => this.setActivity());
    }

    setActivity(anime=null, episode=null) {
        let details = anime 
            ? "Watching an anime"
            : "Browsing animes";

        let state = anime
            ? `${anime} episode ${episode}`
            : null;

        let activity = {
            details: details
        }

        if(anime) activity.startTimestamp = new Date();

        if(state) activity.state = state;

        this.client.setActivity(activity);
    }
};