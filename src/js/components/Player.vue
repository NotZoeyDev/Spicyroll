<template>
    <div class="player-container" v-if="show" ref="container" v-on:keyup.esc="escapeHandler" tabindex="0">
        <p v-if="!ready" class="player-loading">
            Loading {{ this.info.name }} Episode {{ this.info.episode + 1 }}
        </p>
        <div class="player-video-wrapper hide" ref="wrapper">
            <video class="video-js player-video" controls ref="player">
                <track v-if="track" label="English" kind="subtitles" srclang="en" :src="track" default>
            </video>
        </div>
    </div>
</template>

<script>
import TorrentManager from '../libs/torrent';

export default {
    data() {
        return {
            show: false,
            ready: false,
            info: null,
            track: null,
            file: null,
            subtitleInterval: null,

            // Torrent stuff
            client: null,
            server: null
        }
    },

    mounted() {
        this.$parent.$on('openPlayer', (link, anime, episode) => {
            this.$parent.$emit('toggleSearch', false);

            this.info = {
                name: anime,
                episode: episode
            };

            this.show = true;

            TorrentManager.streamEpisode(link, anime).then(data => {
                if(data) {
                    this.client = data.client;
                    this.server = data.server;
                    this.openPlayer(data);
                } else {
                    this.$parent.$emit("MessageBox", {
                        text: "Couldn't load the episode, please try again later.",
                        duration: 5
                    });

                    this.$refs.container.classList.add("hide");

                    setTimeout(() => {
                        this.show = false;
                    }, 200);
                }
            });
        });
    },

    methods: {
        openPlayer(data) {
            this.ready = true;
            this.file = data.file;
            this.$refs.wrapper.classList.remove("hide");

            // Start our stream
            var videoElement = this.$refs.player;
            videoElement.src = `http://localhost:3000/0?=${Math.random()}`;
            videoElement.play();

            // Event listener for the player
            videoElement.addEventListener("ended", () => {
                this.closePlayer();
            })

            // Extract the subtitles (Fetch it every 30 seconds to make sure it's updated)
            let fetchSubs = () => {
                TorrentManager.extractSubs(data.file).then((subfile, done) => {
                    this.track = null;
                    
                    setTimeout(() => {
                        this.track = subfile;
                    }, 100);

                    if(done) {
                        clearInterval(this.subtitleInterval);
                        this.subtitleInterval = null;
                    }
                });
            }

            this.subtitleInterval = setInterval(() => {
                fetchSubs();
            }, 30*1000);

            fetchSubs();
        },

        escapeHandler() {
            // Make sure the playing is running before allowing the user to exit (It could cause issues otherwise)
            if(this.ready)
                this.closePlayer();
        },

        closePlayer() {
            let path = require('path'), fs = require('fs');

            // Close the subtitle loop
            if(this.subtitleInterval != null)
                clearInterval(this.subtitleInterval);

            this.subtitleInterval = null;

            // Delete the subtitle file
            if(fs.existsSync(this.track))
                fs.unlinkSync(this.track);

            // Should we delete the video file
            if(this.client.progress < 1) {
                fs.unlinkSync(this.file);

                // Delete the folder if empty
                if(fs.readdirSync(path.dirname(this.file)).length == 0)
                    fs.rmdirSync(path.dirname(this.file));
            }

            // Shutdown webtorrent
            this.server.close();
            this.client.destroy();

            // Stop the player
            if(!this.$refs.player.paused)
                this.$refs.player.pause();

            this.$refs.player.src = "";

            // Reset our player
            this.ready = false;
            this.track = null;
            this.file = null;

            this.$refs.container.classList.add("hide");

            setTimeout(() => {
                this.show = false;
            }, 200);
        }
    }
}
</script>

<style>
    .player-container.hide {
        animation: close-anim .2s ease-out 1 normal forwards;
    }

    .player-container {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: black;
        z-index: 4;
        animation: open-anim .2s ease-out 1 normal forwards;
    }

    @keyframes open-anim {
        from {
            opacity: 0;
        } to {
            opacity: 1;
        }
    }

    @keyframes close-anim {
        from {
            opacity: 1;
        } to {
            opacity: 0;
        }
    }

    .player-loading {
        position: fixed;
        width: 100%;
        font-size: 2em;
        text-align: center;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        user-select: none;
    }

    .player-video-wrapper.hide {
        display: none;
    }

    .player-video-wrapper {
        position: fixed;
        width: 100%;
        height: 100%;
    }

    .player-video {
        position: fixed;
        object-fit: contain;
        width: 100%;
        height: 100%;
    }
</style>
