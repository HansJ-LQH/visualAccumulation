<!-- 绘制工具栏 -->
<template>
    <div class="draw-tools">
        <div class="draw-tools-btn" @click="changeMode('draw_point')">点</div>
        <div class="draw-tools-btn" @click="changeMode('draw_line_string')">线</div>
        <div class="draw-tools-btn" @click="changeMode('draw_polygon')">面</div>
        <div class="draw-tools-btn" @click="removeFeature">删</div>
    </div>
</template>

<script>
import mapSdk from '../../cesium/cesiumSdk';

export default {
    name: 'DrawTools',
    data() {
        return {
            eventList: [],
            currentSelectId: null,
        };
    },

    components: {},

    methods: {
        removeFeature() {
            mapSdk.mapDraw.removeFeature(this.currentSelectId);
        },
        changeMode(drawType) {
            mapSdk.mapDraw.changeMode(drawType);
        },
        initDrawPubsub() {
            const { eventTopics, pubsub } = mapSdk.mapDraw;
            const { symbolCreated, symbolSelected, symbolUpdated } = eventTopics;
            const graphicDrawnEvent = pubsub.subscribe(symbolCreated, (msg, data) => {
                console.log('图形创建:', data.feature);
            });
            const graphicSelectedEvent = pubsub.subscribe(symbolSelected, (msg, data) => {
                console.log('图形选中:', data.feature);
                this.currentSelectId = data.feature?.id;
            });
            const graphicUpdatedEvent = pubsub.subscribe(symbolUpdated, (msg, data) => {
                console.log('图形更新:', data.feature);
            });
            this.eventList = [graphicDrawnEvent, graphicSelectedEvent, graphicUpdatedEvent];
        },
        // 取消订阅事件
        unSubscribePlotEvents() {
            const { pubsub } = mapSdk.mapDraw;
            this.eventList.forEach(item => {
                pubsub.unsubscribe(item);
            });
        },
    },
    mounted() {
        this.initDrawPubsub();
    },
    destroyed() {
        this.unSubscribePlotEvents();
    },
};
</script>
<style lang="scss" scoped>
.draw-tools {
    position: fixed;
    top: 20px;
    left: 70px;
    display: flex;
    flex-direction: column;
    border-top: 1px solid #d3d3d3;
    border-left: 1px solid #d3d3d3;
    border-right: 1px solid #d3d3d3;
    .draw-tools-btn {
        display: block;
        width: 30px;
        height: 30px;
        border-bottom: 1px solid #d3d3d3;
        background-color: #fff;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        user-select: none;
    }
    .draw-tools-btn:hover {
        background-color: #e6e6e6;
    }
    .draw-tools-btn-hover {
        background-color: #e6e6e6;
    }
}
</style>
