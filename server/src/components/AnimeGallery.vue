<template>
    <div class="gallery">
        <AnimeCard v-for="anime in animes" :key="anime.code" :anime="anime"/>
    </div>
</template>

<script>
import AnimeCard from './items/AnimeCard.vue';

export default {
    props: ['animes'],

    components: { AnimeCard}
}
</script>

<style>
.gallery {
    height: calc(100% - 45px);
    width: 100%;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    padding: 5px 0px 0px 0px;
}
</style>
