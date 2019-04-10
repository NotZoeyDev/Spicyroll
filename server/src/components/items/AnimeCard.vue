<template>
    <div class="card-container" v-on:click="openAnimeWindow">
        <div class="card">
            <img class="card-cover" :src="anime.cover" />

            <div class="card-title">
                <p>{{ anime.name }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: ['anime'],

    methods: {
        async openAnimeWindow() {
            // Open the Anime Viewer window
            this.$parent.$parent.$emit("open-window", {
                window: "AnimeViewer",
                data: this.anime
            });
        }
    }
}
</script>

<style>
    .card-container {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        margin: 5px;
    }

    .card {
        display: flex;
        flex-direction: column-reverse;
        height: 100%;
        overflow: hidden;
        cursor: pointer;
        border-radius: 5px;
    }

    .card:hover .card-cover {
        transform: scale(1.1);
    }

    .card-cover {
        object-fit: cover;
        flex: 1;
        transition: transform .2s;
        transform: scale(1.0);
    }

    .card-title {
        position: absolute;
        width: 100%;
        background-color: rgba(20, 20, 20, 0.75);
        color: white;
    }

    .card-title p {
        user-select: none;
        flex: 1;
        padding: 5px;
    }
</style>
