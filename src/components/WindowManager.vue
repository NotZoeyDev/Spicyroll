<template>
    <div v-on:click.self="closeWindow()" :class="'window-wrapper' + (this.window == null ? ' hide' : '')">
        <div class="window-container">
            <component v-if="window != null" :is="window" :data="data" />
        </div>
    </div>
</template>

<script>
// Import our available Windows
import AnimeViewer from './windows/AnimeViewer.vue';

export default {
    components: { AnimeViewer },

    data() {
        return {
            window: null,
            data: null
        }
    },

    mounted() {
        // Open the window
        this.$parent.$on("open-window", data => {
            this.window = data.window;
            this.data = data.data;
        });
    },

    methods: {
        closeWindow() {
            this.window = null;
            this.data = null;
        }
    }
}
</script>

<style>
    .window-wrapper.hide {
        opacity: 0;
        pointer-events: none;
    }

    .window-wrapper {
        position: absolute;
        pointer-events: all;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 3;
        opacity: 1;
        transition: opacity .2s;
        background-color: rgba(0, 0, 0, 0.75);
    }

    .window-container {
        position: absolute;
        border-radius: 5px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgb(30, 30, 30);
    }
</style>
