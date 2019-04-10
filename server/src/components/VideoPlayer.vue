<template>
    <div :class="'video-player-container' + (!show ? ' hide' : '')">
        <video v-if="video" :src="video" controls autoplay ref="player">
            <track v-if="track" label="English" kind="subtitles" srclang="en" :src="track" default>
        </video>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            show: false,
            video: null,

            track: null,
            subInterval: null
        }
    },

    async mounted() {
        this.$parent.$on('open-player', async (data) => {
            this.show = true;

            let response = await axios.post("/torrent/stream", data);

            this.file = response.data.file;

            this.video = "http://localhost:3001/0";
            this.track = "/torrent/sub";

            this.subInterval = setInterval(() => this.fetchSubs(),  30*1000);
        });
    },

    methods: {
        async fetchSubs() {
            this.track = null;
            setTimeout(() => {
                this.track = "/torrent/sub";
            })
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
