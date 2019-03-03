<template>
    <div class="search-view-background" v-if="show" v-on:click.self="hide" ref="view" v-on:keyup.esc="hide()" tabindex="0">
        <div class="search-view">
            <div class="inner-search-view">
                <div class="search-view-input">
                    <input type="text" v-on:keyup="search()" ref="input" autofocus/>
                </div>
                <div class="search-view-results">
                    <p class="search-view-results-text" v-for="anime in searchAnimes" :key="anime.name" v-on:click="showAnime(anime)">
                        {{ anime.name }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import API from "../libs/api";

export default {
    data() {
        return {
            show: false,
            animes: [],
            searchAnimes: []
        }
    },

    mounted() {
        API.fetchAnimes().then((animes) => {
            this.animes = animes;
            this.searchAnimes = animes;
        });

        this.$parent.$on('showSearchView', () => {
            if(!this.show) {
                this.show = true;
                setTimeout(() => {
                    this.$refs.input.focus();
                }, 100);
            }
        });
    },

    methods: {
        search() {
            let searchText = this.$refs.input.value.trim().toLowerCase();
            this.searchAnimes = [];

            for(let anime of this.animes) {
                if(anime.name.toLowerCase().startsWith(searchText) || anime.name.toLowerCase().includes(searchText)) 
                    this.searchAnimes.push(anime);
            }
        },

        hide() {
            this.$refs.view.classList.add('hide');

            setTimeout(() => {
                this.show = false;
                this.searchAnimes = this.animes;
            }, 200);
        },
        
        showAnime(anime) {
            this.hide();
            this.$parent.$emit("showAnimeView", anime);
        }
    }
}
</script>

<style>
    .search-view-background.hide {
        animation: search-view-container-animation-hide .2s ease 1 normal forwards;
    }

    .search-view-background.hide .search-view {
        animation: search-view-animation-hide .2s ease 1 normal forwards;
    }

    .search-view-background {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(30, 30, 30, 0.75);
        z-index: 2;
        animation: search-view-container-animation .2s ease 1 normal forwards;
    }

    .search-view {
        position: absolute;
        display: flex;
        width: 600px;
        height: 300px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgb(50, 50, 50);
        border-radius: 3px;
        color: white;
        animation: search-view-animation .2s ease-out 1 normal forwards;
    }

    .inner-search-view {
        margin: 15px;
        border-radius: 3px;
        background-color: rgb(40, 40, 40);
        box-shadow: 0px 0px 5px rgb(40, 40, 40);
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .search-view-input {
        display: flex;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        background-color: rgb(75, 75, 75);
        height: 40px;
        align-items: center;
    }

    .search-view-input input {
        font-size: 20px;
        margin-left: 10px;
        margin-right: 10px;
        background-color: transparent;
        border: 0;
        outline: 0;
        width: 100%;
        color: white;
    }

    .search-view-input input:active {
        outline: 0;
    }

    .search-view-results {
        display: flex;
        flex-direction: column;
        flex: 1;
        background-color: rgb(40, 40, 40);
        
        overflow-y: scroll;
    }

    .search-view-results-text {
        background-color: rgb(40, 40, 40);
        user-select: none;
        padding: 5px;
        cursor: pointer;
        transition: background-color .2s;
    }

    .search-view-results-text:hover {
        background-color: rgb(30, 30, 30);
    }

    @keyframes search-view-animation {
        0% {
            transform: translate(-50%, -50%) scale(0);
        }

        75% {
            transform: translate(-50%, -50%) scale(1.05);
        }

        100% {
            transform: translate(-50%, -50%) scale(1.0);
        }
    }

    @keyframes search-view-animation-hide {
        0% {
            transform: translate(-50%, -50%) scale(1.0);
        }

        25% {
            transform: translate(-50%, -50%) scale(1.05);
        }

        100% {
            transform: translate(-50%, -50%) scale(0);
        }
    }

    @keyframes search-view-container-animation {
        from {
            background-color: rgba(0, 0, 0, 0);
        }

        to {
            background-color: rgba(0, 0, 0, 0.75);
        }
    }

    @keyframes search-view-container-animation-hide {
        from {
            background-color: rgba(0, 0, 0, 0.75);
        }

        to {
            background-color: rgba(0, 0, 0, 0);
        }
    }
</style>