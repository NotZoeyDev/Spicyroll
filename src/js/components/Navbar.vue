<template>
    <nav>
        <h2 v-on:click="goToTop()">{{ name }}</h2>
    </nav>
</template>

<script>
    export default {
        data() {
            return {
                name: "Spicyroll"
            }
        },

        mounted() {
            
        },

        methods: {
            goToTop() {
                document.querySelector(".animes-list").scrollTop = 0;
            }
        }
    }
</script>

<style module>
    nav {
        background-color: #F44336;
        color: white;
        display: flex;
        flex: 0 0 40px;
        height: 40px;
        justify-content: space-between;
        box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.25);
        z-index: 1;
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

    nav input[type="text"] {
        border: 0;
        padding: 5px 3px 5px 2px;
        height: 10px;
        width: 200px;
        margin: 10px 10px 0px 0px;
        border-radius: 2px;
    }

    nav input[type="text"]:focus {
        outline: none;
    }
</style>
