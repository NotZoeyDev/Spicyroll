/*
    Our front-end main entry-point
*/

// Import vue
import Vue from "vue";

// Import our "Main" view
import MainView from "./Main.vue";

// Load vue
new Vue(MainView).$mount("#app");