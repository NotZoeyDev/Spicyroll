<template>
    <div :class="'video-player-container' + (!show ? ' hide' : '')">
        <video v-if="video" :src="video" controls autoplay ref="player">
            <track label="English" kind="subtitles" srclang="en" default ref="track">
        </video>
    </div>
</template>

<script>
import axios from 'axios';
import { ipcRenderer } from 'electron';

export default {
    data() {
        return {
            show: false,
            video: null
        }
    },

    async mounted() {
        this.$parent.$on('open-player', async (data) => {
            ipcRenderer.send("torrent-start", data.url);

            ipcRenderer.on("torrent-stream", (event, args) => {
                this.video = args;
                this.show = true;
            });

            ipcRenderer.on('torrent-subtitle', (event, args) => {
                this.handleSubtitles(args);
            });
        });
    },

    methods: {
        async handleSubtitles(sub) {
            let start = sub.time/1000;
            let end = start + (sub.duration/1000);
            let cue = new VTTCue(start, end, sub.text);
            
            this.$refs.player.textTracks[0].addCue(cue);
        }
    }
}
</script>

<style>
    .video-player-container.hide {
        top: 100%;
    }

    .video-player-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: top .2s;
        display: flex;
        z-index: 5;
        background-color: black;
    }

    .video-player-container video {
        object-fit: contain;
        width: 100%;
        height: 100%;
    }
</style>
