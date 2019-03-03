<template>
    <nav>
        <h2 v-on:click="goToTop()">{{ name }}</h2>

        <input type="text" placeholder="search" class="search-bar" v-on:keyup="search()" ref="input" v-on:focus="show = true" v-on:blur="show = false"/>

        <div class="search-results" v-if="show">
            <span v-for="anime in searchAnimes" :key="anime.name.split(' ').join('')" v-on:mousedown="openAnime(anime)">{{ anime.name }}</span>
        </div>
    </nav>
</template>

<script>
import axios from 'axios';

import animes from '../lib/animes';

export default {
    props: [ "name" ],

    data() {
        return {
            animes: [],
            searchAnimes: [],
            show: false
        }
    },

    async mounted() {
        this.animes = await animes.getAllAnimes();
        this.searchAnimes = this.animes;
    },

    methods: {
        goToTop() {
            document.querySelector(".animes-list").scrollTop = 0
        },

        search() {
            let query = this.$refs.input.value.toLowerCase();

            this.searchAnimes = [];
            this.animes.forEach(anime => {
                if(anime.name.toLowerCase().includes(query))
                    this.searchAnimes.push(anime);
            });
        },

        async openAnime(_anime) {
            let anime = _anime;
            anime.cover = await animes.getAnimeCover(anime.code);
            this.$parent.$emit("open-window", {window: "AnimeViewer", data: anime});
        }
    }
}
</script>

<style>
    nav {
        background-color: #F44336;
        color: white;
        display: flex;
        height: 40px;
        justify-content: space-between;
        box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.25);
        z-index: 1;
    }

    .search-bar {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 400px;
        height: 30px;
        margin: 5px 0px 5px 0px;
        padding: 0px 10px 0px 10px;
        border: 0;
        outline: 0;
        background-color: white;
        box-shadow: 0px 0px 0px rgb(20, 20, 20);
        color: black;
        border-radius: 3px 3px 3px 3px;
        transition: all .2s;
    }

    .search-bar:focus {
        background-color: rgb(20, 20, 20);
        box-shadow: 0px 0px 5px rgb(20, 20, 20);
        border-radius: 3px 3px 0px 0px;
        color: white;
    }

    .search-results {
        position: absolute;
        z-index: 3;
        top: 35px;
        left: 50%;
        width: 420px;
        max-height: 300px;
        transform: translateX(-50%);
        background-color: rgb(20, 20, 20);
        border-radius: 0px 0px 3px 3px;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        box-shadow: 0px 0px 5px rgb(20, 20, 20);
    }

    .search-results span:hover {
        background-color: rgb(30, 30, 30);
    }

    .search-results span {
        cursor: pointer;
        padding: 2px 5px 2px 5px;
        transition: all .2s;
    }

    nav h2 {
        padding: 0px 5px 0px 5px;
        cursor: pointer;
        transition: background-color .2s;
        line-height: 40px;
    }

    nav h2:hover {
        background-color: rgb(240, 90, 80);
    }

    nav h2:active {
        background-color: rgb(240, 90, 60);
    }
</style>
