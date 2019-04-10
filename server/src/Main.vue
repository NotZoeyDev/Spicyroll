<template>
    <main>
        <Navbar :name="this.appName"/>
        <VideoPlayer />
        <WindowManager />
        <AnimeGallery :animes="this.animes"/>
    </main>
</template>

<script>
// Our navbar
import Navbar from './components/Navbar.vue';

// Anime list
import AnimeGallery from './components/AnimeGallery.vue';

// Window manager
import WindowManager from './components/WindowManager.vue';

// VideoPlayer
import VideoPlayer from './components/VideoPlayer.vue';

// Axios
import axios from 'axios';

export default {
    components: { Navbar, AnimeGallery, WindowManager, VideoPlayer},

    data() {
        return {
            appName: "Spicyroll",
            animes: []
        }
    },

    async mounted() {
        let response = await axios.get("/animes/current");

        this.animes = response.data;
    }
}
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Open+Sans');

    * {
        padding: 0;
        margin: 0;
    }

    html, body, main {
        width: 100%;
        height: 100%;
        font-family: 'Open Sans', sans-serif;
    }

    body {
        overflow: hidden;
        background-color: rgb(30, 30, 30);
    }
</style>
