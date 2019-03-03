/*
    Vue-Router setup
*/

// Our pages
let Home = () => import('./pages/Home.vue');
let Info = () => import('./pages/AnimeInfo.vue');
let Player = () => import('./pages/Player.vue');

// Our routes
const routes = [
    {
        path: '/',
        component: Home
    }, {
        path: '/',
        component: Bar
    }
]