import state from '../store/state';
// import MapDraw from './mapDraw/MapDraw';
import MapDraw from './cesium-draw/index';
import mode from '../plotAlgorithms/closedCurve';

const { Cesium } = window;

class MapSdk extends EventTarget {
    constructor() {
        super();
        // this.mapCenterLongitude = 107.34145981478143;
        // this.mapCenterLatitude = 36.26907364872889;
        this.mapCenterLongitude = 114.17944310326004;
        this.mapCenterLatitude = 22.65386345002168;
        this.viewer = null;
        this.state = state;
        this.mapDraw = null;
        window.mapSdk = this;
    }

    test(coordinates) {
        const option = {
            coordinates,
            // startPoint,
            // endPoint,
            // leftTailPoint,
            // rigthTailPoint,
            // leftArrowPoint,
            // rigthArrowPoint,
        };

        this.data = mode.generateClosedCurve(option);
        console.log('HJJ ', this.data);
    }

    init() {
        Cesium.Ion.defaultAccessToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1Y2EzNzVjYS04NmQyLTRmMTAtODJiOS1lZGM5ZDRiM2FhOWQiLCJpZCI6MTA2MzA4LCJpYXQiOjE2NjE4MjM0MTZ9.DGLjWbAslgVOr34TMPn0tN2UWXqafI4qWCGxzQ9G_nI';
        this.viewer = new Cesium.Viewer('cesiumContainer', {
            animation: false, // 是否创建动画小器件，左下角仪表
            baseLayerPicker: false, // 是否显示图层选择器
            geocoder: false, // 是否显示geocoder小器件，右上角查询按钮
            infoBox: false, // 是否显示信息框
            selectionIndicator: false, // 是否显示选取指示器组件
            navigationHelpButton: false, // 是否显示右上角的帮助按钮
            fullscreenButton: false, // 是否显示全屏按钮
            timeline: false, // 是否显示时间轴
            // homeButton: false, //是否显示Home按钮
            // sceneModePicker: false, //是否显示3D/2D选择器,与scene3DOnly不能同时为true
            // scene3DOnly: true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
            // targetFrameRate: 10, // 帧率
            clock: new Cesium.Clock(), // 用于控制当前时间的时钟对象
            shadows: true,
            shouldAnimate: true, // 使用动画
        });
        // 去除版权信息
        // eslint-disable-next-line no-underscore-dangle
        this.viewer._cesiumWidget._creditContainer.style.display = 'none';
        // 取消实例的双击事件
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
        );
        window.viewer = this.viewer;
        this.mapDraw = new MapDraw({ viewer: this.viewer });
        this.resetZoomView();
    }

    flyToPoint(options) {
        const {
            longitude = this.mapCenterLongitude,
            latitude = this.mapCenterLatitude,
            duration = 2,
            height = 5000,
            heading = 0,
            pitch = -89,
        } = options;
        this.viewer.scene.camera.flyTo({
            // eslint-disable-next-line no-undef
            destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
            orientation: {
                // eslint-disable-next-line no-undef
                heading: Cesium.Math.toRadians(heading),
                // eslint-disable-next-line no-undef
                pitch: Cesium.Math.toRadians(pitch),
                roll: 0.0,
            },
            duration,
        });
    }

    resetZoomView() {
        this.flyToPoint({
            longitude: this.mapCenterLongitude,
            latitude: this.mapCenterLatitude,
            duration: 1,
            height: this.zoomToHeight(10),
            heading: 0,
            pitch: -90,
        });
    }

    resetPitch() {
        const { longitude, latitude } = this.getCurrentMapCenterPoint();
        this.viewer.scene.camera.flyTo({
            // eslint-disable-next-line no-undef
            destination: Cesium.Cartesian3.fromDegrees(
                longitude,
                latitude,
                Math.ceil(this.viewer.camera.positionCartographic.height)
            ),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                // eslint-disable-next-line no-undef
                pitch: Cesium.Math.toRadians(-90),
                roll: 0.0,
            },
            duration: 2,
        });
    }

    zoomLevel(level) {
        const height = this.zoomToHeight(level);
        const { longitude, latitude } = this.getCurrentMapCenterPoint();
        this.viewer.scene.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
            duration: 1,
        });
    }

    getCurrentMapCenterPoint() {
        const result = this.viewer.camera.pickEllipsoid(
            new Cesium.Cartesian2(
                this.viewer.canvas.clientWidth / 2,
                this.viewer.canvas.clientHeight / 2
            )
        );
        const curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result);
        return {
            longitude: (curPosition.longitude * 180) / Math.PI,
            latitude: (curPosition.latitude * 180) / Math.PI,
        };
    }

    // eslint-disable-next-line class-methods-use-this
    zoomToHeight(zoom) {
        const A = 40487.57;
        const B = 0.00007096758;
        const C = 91610.74;
        const D = -40467.74;
        // eslint-disable-next-line no-restricted-properties
        return Math.round(C * Math.pow((A - D) / (zoom - D) - 1, 1 / B));
    }

    // eslint-disable-next-line class-methods-use-this
    heightToZoom(height) {
        const A = 40487.57;
        const B = 0.00007096758;
        const C = 91610.74;
        const D = -40467.74;

        // 返回结果包含小数
        // return Math.round(D + (A - D) / (1 + (height / C) ** B));
        // 返回结果替换为整数
        let zoom = Math.round(D + (A - D) / (1 + (height / C) ** B)).toFixed();
        if (zoom < 1) zoom = 1;
        if (zoom > 24) zoom = 24;
        return +zoom;
    }
}

export default new MapSdk();
