<!-- ThreeContainer -->
<template>
    <div id="three-container"></div>
</template>

<script>
import threeSdk from '../../three/threeSdk';

export default {
    name: 'ThreeContainer',
    data() {
        return {};
    },

    components: {},

    methods: {},

    mounted() {
        threeSdk.init();
    },

    destroyed(){
        threeSdk.destroy();
    }
};
</script>
<style lang="scss" scoped>
#three-container{
    height: 100vh;
    width: 100vw;
}
</style>
