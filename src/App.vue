<template>
    <div id="app">
        <div id="nav">
            <router-link to="/">Home</router-link> | <router-link to="/three">Three</router-link> |
            <router-link to="/canvas">Canvas</router-link> |
            <router-link to="/mapbox">Mapbox</router-link> |
            <router-link to="/cesium">Cesium</router-link> |
            <router-link to="/leaflet">Leaflet</router-link> |
            <router-link to="/chatGPT">ChatGPT</router-link>
        </div>
        <router-view />
    </div>
</template>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    position: fixed;
    right: 85px;
    top: 0;
    padding: 12px;
    background-color: rgba($color: #ffffff, $alpha: 0.5);
    z-index: 10;
    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
