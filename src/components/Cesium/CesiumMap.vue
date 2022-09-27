<!-- Cesium Map -->
<template>
    <div>
        <div id="cesiumContainer"></div>
    </div>
</template>

<script>
import mapSdk from '../../cesium/cesiumSdk';

export default {
    name: 'CesiumMap',
    data() {
        return {};
    },

    components: {},

    methods: {},

    mounted() {
        mapSdk.init();
    },
};
</script>
<style lang="scss">
#cesiumContainer {
    width: 100vw;
    height: 100vh;
}
</style>
