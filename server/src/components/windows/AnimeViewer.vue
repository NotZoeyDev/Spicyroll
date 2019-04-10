<template>
    <div class="anime-window" v-if="this.episodes.length > 0">
        <div class="anime-window-title">
            <h2> {{ anime.name }}</h2>
        </div>

        <div class="anime-window-content">
            <div class="anime-window-cover">
                <img :src="anime.cover" />
            </div>

            <div class="anime-window-episodes">
                <span v-for="episode in episodes" :key="episode.id" v-on:click="selectEpisode(episode)" :ref="episode.id">{{ `Episode ${episode.id}` }}</span>
            </div>

            <div class="anime-window-qualities" v-if="episode != null">
                <span v-for="quality in episode.qualities" :key="quality.id" v-on:click="playEpisode(episode.links[episode.qualities.indexOf(quality)])">{{ quality }}</span>
            </div>

            <div class="anime-window-qualities" v-else />
        </div>
    </div>
</template>

<script>
// Axios
import axios from 'axios';

export default {
   
    props: [ "data" ],

    data() {
        return {
            anime: this.data,
            episodes: [],
            episode: null
        }
    },

    async mounted() {
        // Load the episodes list
        let response = await axios.get(`/animes/show/${this.anime.code}`);

        // Add them to the anime
        this.episodes = response.data.reverse();
    },

    methods: {
        selectEpisode(episode) {
            let selectedEpisode = document.querySelector("span.sel");
            
            if(selectedEpisode)
                selectedEpisode.classList.remove("sel");

            this.$refs[episode.id][0].classList.add("sel");

            this.episode = episode;
        },

        async playEpisode(link) {
            this.$parent.$parent.$emit("open-player", {url: link, anime: this.anime});
        }
    }
}
</script>

<style>
    .anime-window {
        width: 700px;
        height: 400px;
        display: flex;
        flex-direction: column;
        padding: 15px;
        color: white;
    }

    .anime-window-title {
        margin-bottom: 20px;
        font-size: 1em;
        user-select: none;
    }

    .anime-window-content {
        display: flex;
        justify-content: space-between;
        flex: 1;
        height: 350px;
    }

    .anime-window-content div {
        flex-basis: 30%;
    }

    .anime-window-cover img {
        object-fit: cover;
        height: 100%;
        width: 100%;
        box-shadow: 0px 0px 15px rgb(0, 0, 0, 0.5);
    }

    .anime-window-episodes, .anime-window-qualities {
        display: flex;
        flex-basis: 30%;
        flex-direction: column;
        overflow-y: auto;
    }

    .anime-window-qualities {
        justify-content: center;
    }

    .anime-window-content span.sel {
        background-color: rgb(200, 200, 200);
        color: black;
    }

    .anime-window-content span {
        padding: 10px;
        margin: 5px 10px 5px 0px;
        border-radius: 2px;
        background-color: rgb(15, 15, 15);
        cursor: pointer;
        user-select: none;
        transition: background-color .2s, color .2s;
        box-shadow: 0px 0px 5px rgb(0, 0, 0, 0.5);
    }
</style>
