<template>
    <section class="animes-list">
        <div class="anime-card" v-for="anime in animes" 
            :key="anime.code">

            <div class="card-container"
                v-on:mouseover="showName(true, anime.name)"
                v-on:mouseleave="showName(false, anime.name)"
                v-on:click="showAnime(anime)">
                <div class="anime-text-wrapper">
                    <p class="anime-name" :ref="anime.name" data-show="false">{{ anime.name }}</p>
                </div>
                <img :src="anime.cover" />
            </div>
        </div>
    </section>
</template>

<script>
import API from "../libs/api";

export default {
    data() {
        return {
            animes: []
        }
    },

    mounted() {
        API.fetchCurrentAnimes().then(animes => {
            this.$parent.loading = false;
            this.animes = animes;
        });
    },

    methods: {
        showName(toggle, name) {
            this.$refs[name][0].dataset.show = toggle;
        },

        showAnime(anime) {
            this.$parent.$emit("showAnimeView", anime);
        }
    }
}
</script>

<style>
    .animes-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        height: calc(100% - 45px);
        overflow-y: scroll;
        padding: 5px 0px 0px 0px
    }

    .anime-card {
        display: flex;
        margin: 10px;
        justify-content: center;
        align-items: center;
    }

    .card-container {
        display: flex;
        cursor: pointer;
        flex-direction: column-reverse;
        border-radius: 2px;
        position: relative;
        align-items: center;
        transform: scale(1);
        transition: transform .1s;
        box-shadow: 0px 0px 15px rgb(0, 0, 0, 0.5);
    }

    .card-container:hover {
        box-shadow: 0px 0px 25px rgb(0, 0, 0, 0.75);
        transform: scale(1.1);
    }

    .card-container img {
        border-radius: 2px;
    }

    .anime-text-wrapper {
        position: absolute;
        width: 100%;
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;
    }

    .anime-name {
        display: none;
        background-color: rgba(20, 20, 20, 0.75);
        color: white;
        padding: 5px;
        flex: 1;
        user-select: none;
    }

    .anime-name[data-show="true"] {
        display: block;
    }
</style>
