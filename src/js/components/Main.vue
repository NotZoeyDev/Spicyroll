<template>
    <main>
        <div class="loading-indicator" v-if="loading">
            <p>{{ loadingText }}</p>
        </div>
        
        <MessageBox></MessageBox>
        <Player></Player>
        <AnimeView></AnimeView>
        <SearchView></SearchView>
        <Navbar></Navbar>
        <List></List>
    </main>
</template>

<script>
import MessageBox from './MessageBox.vue';
import Player from './Player.vue';
import AnimeView from './AnimeView.vue';
import SearchView from './SearchView.vue';
import Navbar from './Navbar.vue';
import List from './List.vue';
import DiscordRPC from "../libs/discord";

export default {
    components: {
        MessageBox, Player, AnimeView, SearchView, Navbar, List
    },

    data() {
        return {
            loading: true,
            searchEnabled: true,
            loadingText: "Fetching animes",
            discord: new DiscordRPC()
        }
    },

    mounted() {
        this.$on('toggleSearch', (toggle) => {
            this.searchEnabled = toggle;
        });

        document.addEventListener('keypress', () => {
            if(!this.loading && this.searchEnabled) {
                this.$emit("showSearchView");
            }
        });
    }
}
</script>

<style>

</style>
