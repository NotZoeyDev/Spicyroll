<template>
    <div v-on:click="hideHandler" class="anime-view-container" v-if="show" ref="view" v-on:keyup.esc="hideView()" tabindex="0">
        <div class="anime-view">
            <div class="anime-title">
                <h2> {{ anime.name }} </h2>
            </div>

            <div class="anime-info">
                <div class="anime-cover-container">
                    <img class="anime-cover" :src="cover"/>
                </div>

                <div class="anime-episodes-list">
                    <span v-on:click="showEpisode(episode.id)" v-for="episode in episodes" :key="episode.id" :ref="parseInt(episode.id) - 1">
                        Episode {{ episode.id }}
                    </span>
                </div>
                
                <div class="anime-qualities-list" v-if="episode != null">
                    <span v-for="quality in episodes[episode].qualities" :key="quality" v-on:click="loadEpisode(quality)">
                        {{ quality }}
                    </span>
                </div>
                
                <div class="anime-qualities-list" v-else></div>
            </diV>
        </div>
    </div>
</template>
    
<script>
import API from "../libs/api";

export default {
    data() {
        return {
            show: false,
            anime: null,
            cover: null,
            episodes: [],
            episode: null,            
            loading: false
        }
    },

    mounted() {
        this.$parent.$on('showAnimeView', (anime) => {
            this.$parent.$emit('toggleSearch', false);
            this.showView(anime);
        });

        this.$parent.$on('hideAnimeView', () => {
            this.hideView();
        });
    },

    methods: {
        showEpisode(episode) {
            if(this.episode != null) {
                this.$refs[this.episode][0].classList.remove("sel");
            }

            this.episode = parseInt(episode) - 1;

            this.$refs[this.episode][0].classList.add("sel");
        },

        loadEpisode(quality) {
            let link = this.episodes[this.episode].links[this.episodes[this.episode].qualities.indexOf(quality)];
            this.$parent.$emit('openPlayer', link, this.anime.name, this.episode);
        },

        showView(anime) {
            this.$parent.loadingText = "Fetching episodes";
            this.$parent.loading = true;

            if(!this.loading) {
                this.anime = anime;
                this.loading = true;
                API.fetchEpisodes(anime.code).then(episodes => {
                    this.episodes = episodes.reverse();

                    API.getAnimeCoverImage(anime.code, (image, err) => {
                        this.cover = image;

                        this.show = true;
                        this.loading = false;
                        this.$parent.loading = false;

                        setTimeout(() => {
                            this.$refs.view.focus();
                        }, 100);
                    });
                });
            }
        },

        hideView() {
            this.$refs.view.classList.add("hide");

            setTimeout(() => {
                this.show = false;
                this.anime = null;
                this.cover = null;
                this.episode = null;
                this.episodes = [];

                this.$parent.$emit('toggleSearch', true);
            }, 200);
        },

        hideHandler(event) {
            if(event.target.className == "anime-view-container") 
                this.hideView();
        }
    }
}
</script>

<style>
    .anime-view-container.hide {
        animation: anime-view-container-animation-hide .2s ease 1 normal forwards;
    }

    .anime-view-container.hide .anime-view {
        animation: anime-view-animation-hide .2s ease-out 1 normal forwards;
    }

    .anime-view-container {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1;
        transition: opacity .2s;
        animation: anime-view-container-animation .2s ease 1 normal forwards;
        color: white;
    }

    .anime-view {
        position: absolute;
        display: flex;
        flex-direction: column;
        width: 700px;
        height: 400px;
        padding: 15px;
        border-radius: 5px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background-color: rgb(30, 30, 30);
        animation: anime-view-animation .2s ease-out 1 normal forwards;
    }
    
    .anime-title {
        margin-bottom: 20px;
        font-size: 1em;
        user-select: none;
    }

    .anime-info {
        display: flex;
        justify-content: space-between;
    }

    .anime-info span.sel {
        background-color: rgb(200, 200, 200);
        color: black;
    }

    .anime-info span {
        padding: 10px;
        margin: 5px 10px 5px 0px;
        border-radius: 2px;
        background-color: rgb(15, 15, 15);
        cursor: pointer;
        user-select: none;
        box-shadow: 0px 0px 5px rgb(0, 0, 0, 0.5);
        transition: background-color .2s, color .2s;
    }

    .anime-cover-container {
        flex-basis: 30%;    
    }

    .anime-cover {
        object-fit: cover;
        height: 100%;
        width: 100%;
        box-shadow: 0px 0px 15px rgb(0, 0, 0, 0.5);
    }

    .anime-episodes-list {
        display: flex;
        flex-basis: 30%;
        flex-direction: column;
        overflow-y: scroll;
    }

    .anime-qualities-list {
        flex-basis: 30%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    /*
     * Animations
     */

    @keyframes anime-view-animation {
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

    @keyframes anime-view-animation-hide {
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

    @keyframes anime-view-container-animation {
        from {
            background-color: rgba(0, 0, 0, 0);
        }

        to {
            background-color: rgba(0, 0, 0, 0.5);
        }
    }

    @keyframes anime-view-container-animation-hide {
        from {
            background-color: rgba(0, 0, 0, 0.5);
        }

        to {
            background-color: rgba(0, 0, 0, 0);
        }
    }
</style>
